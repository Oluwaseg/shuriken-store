import express from 'express';
import {
  adminLogin,
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
  authorizeRoles,
  isAuthenticated,
} from '../middlewares/authenticate.js';
import { uploadUserImage } from '../middlewares/image.config.js';
const router = express.Router();

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
