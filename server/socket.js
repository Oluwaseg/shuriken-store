import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { activeUsers } from './controllers/userController.js';
import Chat from './models/Chat.js';
import User from './models/User.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Store user connection when they join (userId can come dynamically, e.g., from the client)
    socket.on('joinChat', (userId) => {
      activeUsers[userId] = socket.id; // Store the user's socket ID
      console.log(`${userId} joined the chat`);
    });

    // Admin connects and is identified dynamically (could be through login or socket event)
    socket.on('adminConnect', (adminId) => {
      activeUsers[adminId] = socket.id; // Admin gets added to active users list
      console.log(`${adminId} (Admin) connected`);
    });

    socket.on('sendMessage', async (payload, callback) => {
      try {
        const { senderId, recipientId, message } = payload;

        // Validate payload
        if (!senderId || !recipientId || !message) {
          if (typeof callback === 'function') {
            return callback({
              success: false,
              message: 'Missing senderId, recipientId, or message',
            });
          }
          return;
        }

        // Resolve recipientId if it's the admin
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
          return callback({ success: false, message: 'Admin not found' });
        }
        const resolvedRecipientId =
          recipientId === 'admin' ? adminUser._id : recipientId;

        // Validate IDs
        if (
          !mongoose.Types.ObjectId.isValid(senderId) ||
          !mongoose.Types.ObjectId.isValid(resolvedRecipientId)
        ) {
          return callback({
            success: false,
            message: 'Invalid sender or recipient ID',
          });
        }

        // Emit the message in real-time to the recipient, if online
        if (activeUsers[resolvedRecipientId.toString()]) {
          io.to(activeUsers[resolvedRecipientId.toString()]).emit(
            'receiveMessage',
            {
              senderId,
              message,
              timestamp: new Date(),
            }
          );
        }
        if (typeof callback === 'function') {
          callback({
            success: true,
            message: 'Message forwarded successfully',
          });
        }
      } catch (error) {
        console.error('Error forwarding message:', error.message);
        callback({ success: false, message: error.message });
      }
    });

    // Mark messages as read
    socket.on('messageRead', async ({ userId, adminId }) => {
      try {
        // Update all messages between user and admin as read
        await Chat.updateMany(
          {
            sender: userId,
            recipient: adminId,
            read: false,
          },
          { $set: { read: true } }
        );

        // Notify the sender (if online) about the read status
        if (activeUsers[userId]) {
          io.to(activeUsers[userId]).emit('messagesRead', { userId, adminId });
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      Object.keys(activeUsers).forEach((userId) => {
        if (activeUsers[userId] === socket.id) {
          delete activeUsers[userId];
          console.log(`${userId} disconnected`);
        }
      });
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
