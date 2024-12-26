// models/Chat.js
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (for private chat)
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
  deletedBySender: { type: Boolean, default: false },
  deletedByRecipient: { type: Boolean, default: false },
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
