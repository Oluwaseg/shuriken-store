// controllers/chatController.js
import Chat from '../models/Chat.js';

// Controller to handle saving chat messages
export const sendMessage = async (req, res) => {
  const { senderId, recipientId, message } = req.body;
  try {
    const newMessage = new Chat({
      sender: senderId,
      recipient: recipientId,
      message,
    });
    await newMessage.save();
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
};

// Controller to retrieve chat history
export const getChatHistory = async (req, res) => {
  const { userId, otherUserId } = req.params;

  try {
    const chatHistory = await Chat.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ chatHistory });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat history', error });
  }
};
