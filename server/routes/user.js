import express from 'express';
import {
  adminLogin,
  createAdmin,
  createUser,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getSingleUser,
  getUserDetails,
  logout,
  register,
  resendOTP,
  resetPassword,
  updateProfile,
  updateUserPassword,
  updateUserRole,
  userLogin,
  verifyOTP,
} from '../controllers/userController.js';

import {
  deleteNotification,
  getNotifications,
  markAsRead,
} from '../controllers/notificationController.js';
import {
  authorizeRoles,
  isAuthenticated,
} from '../middlewares/authenticate.js';
import { uploadUserImage } from '../middlewares/image.config.js';
const router = express.Router();

// Admin Routes -- Yet to be implemented
router.post(
  '/user/register-admin',
  isAuthenticated,
  authorizeRoles('admin'),
  createAdmin
);

// User Routes

router.post('/user/create-user', createUser);
router.post('/user/register', uploadUserImage.single('avatar'), register);
router.post('/user/login', userLogin);
router.post('/user/verify-otp', verifyOTP);
router.post('/user/resend-otp', resendOTP);
router.post('/user/logout', logout);
router.post('/user/forgot-password', forgotPassword);
router.put('/user/reset-password/:token', resetPassword);

// User Routes
router.get('/user/me', isAuthenticated, getUserDetails);
router.put(
  '/user/update/me',
  uploadUserImage.single('avatar'),
  isAuthenticated,
  updateProfile
);
router.put('/user/password/update', isAuthenticated, updateUserPassword);

// Notification Routes
router.get('/user/notifications', isAuthenticated, getNotifications);
router.put(
  '/user/notifications/:notificationId/read',
  isAuthenticated,
  markAsRead
);
router.delete(
  '/user/notifications/:notificationId',
  isAuthenticated,
  deleteNotification
);

// Admin Routes
router.post('/admin/login', adminLogin);
router.get(
  '/admin/users',
  isAuthenticated,
  authorizeRoles('admin'),
  getAllUsers
);

router.get(
  '/admin/user/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  getSingleUser
);

router.put(
  '/admin/user/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  updateUserRole
);

router.delete(
  '/admin/user/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  deleteUser
);

export default router;
