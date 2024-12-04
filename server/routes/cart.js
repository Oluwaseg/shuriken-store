import express from 'express';
import {
  clearCart,
  createOrUpdateCart,
  getCartByUserId,
  mergeCart,
  removeItemFromCart,
} from '../controllers/cartController.js';
import { checkout } from '../controllers/checkoutController.js';
import {
  initializePayment,
  verifyPayment,
} from '../controllers/paymentController.js';
import { isAuthenticated } from '../middlewares/authenticate.js';

const router = express.Router();

// Create or update cart
router.post('/cart', isAuthenticated, createOrUpdateCart);

// Get cart by user ID
router.get('/cart/:userId', isAuthenticated, getCartByUserId);

// Remove item from cart
router.delete('/cart/item', isAuthenticated, removeItemFromCart);

// Clear cart
router.delete('/cart/:userId', isAuthenticated, clearCart);
// checkout
router.post('/checkout', isAuthenticated, checkout);

// merge cart (From guest cart to logged in user cart)
router.post('/cart/merge', isAuthenticated, mergeCart);

// Initialize payment
router.post('/payment/initialize', isAuthenticated, initializePayment);

// Verify payment
router.get('/payment/verify/:reference', isAuthenticated, verifyPayment);

export default router;
