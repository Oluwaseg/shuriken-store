import mongoose from 'mongoose';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import { getIO } from '../socket.js';
import { activeUsers } from './userController.js';

export const getChatHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get the admin user's ObjectId
    const adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const adminId = adminUser._id; // Get the admin's ObjectId

    // Find the chat history between the user and the admin
    const chatHistory = await Chat.find({
      $or: [
        { sender: userId, recipient: adminId, deletedBySender: { $ne: true } },
        {
          sender: adminId,
          recipient: userId,
          deletedByRecipient: { $ne: true },
        },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ chatHistory });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Error fetching chat history', error });
  }
};

export const sendMessage = async (req, res) => {
  const { senderId, recipientId, message } = req.body;

  console.log('sendMessage:', senderId, recipientId, message);

  try {
    // Get the admin's ObjectId
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Resolve recipient ID to an ObjectId
    let resolvedRecipientId =
      recipientId === 'admin' ? adminUser._id : recipientId;

    // Validate senderId and resolvedRecipientId
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ message: 'Invalid sender ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(resolvedRecipientId)) {
      return res.status(400).json({ message: 'Invalid recipient ID' });
    }

    // Store the new message in the database
    const newMessage = new Chat({
      sender: senderId,
      recipient: resolvedRecipientId,
      message,
    });
    await newMessage.save();

    // Mark all unread messages between the sender and recipient as read
    await Chat.updateMany(
      {
        sender: resolvedRecipientId,
        recipient: senderId,
        read: false,
      },
      { $set: { read: true } }
    );

    // Check if the recipient is online
    if (activeUsers[resolvedRecipientId.toString()]) {
      getIO()
        .to(activeUsers[resolvedRecipientId.toString()])
        .emit('newMessage', {
          senderId,
          message,
        });
    } else {
      console.log(
        `${resolvedRecipientId} is offline. Message saved for later delivery`
      );
    }

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      messageId: newMessage._id,
      timestamp: newMessage.timestamp,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message', error });
  }
};

// Temporary delete logic for user
export const deleteChatForUser = async (req, res) => {
  const { userId } = req.params;
  const { chatId } = req.body;

  try {
    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the chat message by chatId
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat message not found' });
    }

    // Ensure the current user is either the sender or recipient of the chat
    if (chat.sender.toString() === userId) {
      // Mark the message as deleted for the sender
      chat.deletedBySender = true;
    } else if (chat.recipient.toString() === userId) {
      // Mark the message as deleted for the recipient
      chat.deletedByRecipient = true;
    } else {
      return res.status(403).json({
        message: 'You are not authorized to delete this message',
      });
    }

    // Save the updated chat
    await chat.save();

    return res.status(200).json({ message: 'Message deleted for user' });
  } catch (error) {
    console.error('Error deleting chat for user:', error);
    return res.status(500).json({
      message: 'Error deleting chat for user',
      error: error.message,
    });
  }
};

// Permanent delete logic for entire chat history between user and admin
export const deleteChatPermanently = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get the admin user's ObjectId
    const adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const adminId = adminUser._id; // Admin's ObjectId

    // Delete all chat messages between the user and the admin
    const result = await Chat.deleteMany({
      $or: [
        { sender: userId, recipient: adminId },
        { sender: adminId, recipient: userId },
      ],
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: 'No chat history found to delete' });
    }

    res.status(200).json({ message: 'Chat history deleted permanently' });
  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({ message: 'Error deleting chat history', error });
  }
};

export const softDeleteChat = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get the admin user's ObjectId
    const adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const adminId = adminUser._id;

    // Update chat messages, setting deletedBySender or deletedByRecipient to true
    await Chat.updateMany(
      {
        $or: [
          { sender: userId, recipient: adminId },
          { sender: adminId, recipient: userId },
        ],
      },
      {
        $set: { deletedBySender: true, deletedByRecipient: true },
      }
    );

    res.status(200).json({ message: 'Chat history marked as deleted' });
  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({ message: 'Error deleting chat history', error });
  }
};

export const getAllChatsSummary = async (req, res) => {
  try {
    const { adminId } = req.query;

    // Validate adminId
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: 'Invalid adminId' });
    }

    const adminObjectId = new mongoose.Types.ObjectId(adminId);

    // Check if admin exists
    const adminUser = await User.findById(adminObjectId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Aggregate chats by users
    const chatsSummary = await Chat.aggregate([
      {
        $match: {
          $or: [{ sender: adminObjectId }, { recipient: adminObjectId }],
        },
      },
      {
        $project: {
          otherUser: {
            $cond: [
              { $eq: ['$sender', adminObjectId] },
              '$recipient',
              '$sender',
            ],
          },
          message: 1,
          timestamp: 1,
          read: 1,
        },
      },
      {
        $group: {
          _id: '$otherUser', // Group by other user
          lastMessage: { $last: '$message' },
          lastTimestamp: { $last: '$timestamp' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$read', false] },
                    { $ne: ['$sender', adminObjectId] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $sort: {
          unreadCount: -1, // Sort by unread messages first
          lastTimestamp: -1, // Then by the latest message
        },
      },
      {
        $project: {
          userId: '$_id',
          userName: '$userDetails.name',
          lastMessage: 1,
          lastTimestamp: 1,
          unreadCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Chats summary fetched successfully',
      chatsSummary,
    });
  } catch (error) {
    console.error('Error fetching chats summary:', error);
    res.status(500).json({ message: 'Error fetching chats summary', error });
  }
};
