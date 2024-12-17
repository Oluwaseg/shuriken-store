import { Server } from 'socket.io';

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

    // Listen for send_message event
    socket.on('send_message', async (data) => {
      const { senderId, recipientId, message } = data;

      // Save the message in the database
      try {
        const newMessage = new Chat({
          sender: senderId,
          recipient: recipientId,
          message,
        });
        await newMessage.save();

        // Emit the message to the recipient
        io.to(recipientId).emit('receive_message', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
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
