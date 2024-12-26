// routes/chat.js
import express from 'express';
import {
  deleteChatForUser,
  deleteChatPermanently,
  getAllChatsSummary,
  getChatHistory,
  sendMessage,
} from '../controllers/chatController.js';
import {
  authorizeRoles,
  isAuthenticated,
} from '../middlewares/authenticate.js';

const router = express.Router();

// Send a message
router.post(
  '/chat/send-message',
  isAuthenticated,
  authorizeRoles('user', 'admin'),
  sendMessage
);

// Get chat history
router.get(
  '/chat-history/:userId',
  isAuthenticated,
  authorizeRoles('user', 'admin'),
  getChatHistory
);

// Delete chat for user
router.put(
  '/chat/delete-message/:userId',
  isAuthenticated,
  authorizeRoles('user', 'admin'),
  deleteChatForUser
);

// Permanent delete logic for admin
router.delete(
  '/chat/delete-chat-history/:userId',
  isAuthenticated,
  authorizeRoles('admin'),
  deleteChatPermanently
);

// Get all chats summary
router.get(
  '/chat/summary',
  isAuthenticated,
  authorizeRoles('admin'),
  getAllChatsSummary
);

export default router;
