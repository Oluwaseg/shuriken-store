// routes/chat.js
import express from 'express';
import { getChatHistory, sendMessage } from '../controllers/chatController.js';
import { authorizeRoles } from '../middlewares/authenticate.js';

const router = express.Router();

// Send a message
router.post('/send-message', authorizeRoles('user', 'admin'), sendMessage);

// Get chat history
router.get(
  '/chat-history/:userId/:otherUserId',
  authorizeRoles('user', 'admin'),
  getChatHistory
);

export default router;
