import express from "express";
import {
  createOrUpdateCart,
  getCartByUserId,
  removeItemFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { checkout } from "../controllers/checkoutController.js";
import {
  initializePayment,
  verifyPayment,
} from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/authenticate.js";

const router = express.Router();

// Create or update cart
router.post("/cart", isAuthenticated, createOrUpdateCart);

// Get cart by user ID
router.get("/cart/:userId", isAuthenticated, getCartByUserId);

// Remove item from cart
router.delete("/cart/item", isAuthenticated, removeItemFromCart);

// Clear cart
router.delete("/cart", isAuthenticated, clearCart);

// checkout
router.post("/checkout", isAuthenticated, checkout);

// Initialize payment
router.post("/initialize-payment", isAuthenticated, initializePayment);

// Verify payment
router.get("/verify-payment/:reference", isAuthenticated, verifyPayment);

export default router;
