import express from "express";
import {
  register,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updateUserPassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  verifyOTP,
} from "../controllers/userController.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/authenticate.js";
import { uploadUserImage } from "../middlewares/image.config.js";
const router = express.Router();

router.post("/register", uploadUserImage.single("avatar"), register);

router.post("/verify-otp", verifyOTP);

router.post("/login", loginUser);

router.post("/logout", logout);

router.post("/password/forgot", forgotPassword);

router.put("/password/reset/:token", resetPassword);

router.get("/me", isAuthenticated, getUserDetails);

router.put(
  "/me/update",
  uploadUserImage.single("avatar"),
  isAuthenticated,
  updateProfile
);

router.put("/password/update", isAuthenticated, updateUserPassword);

router.get(
  "/admin/users",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllUsers
);

router.get(
  "/admin/user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  getSingleUser
);

router.put(
  "/admin/user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);

router.delete(
  "/admin/user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);

export default router;
