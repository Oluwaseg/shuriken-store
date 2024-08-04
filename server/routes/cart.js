import express from "express";
import {
  createOrUpdateCart,
  getCartByUserId,
  removeItemFromCart,
  clearCart,
} from "../controllers/cartController.js";
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

export default router;
