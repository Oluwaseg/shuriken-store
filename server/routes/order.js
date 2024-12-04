import express from 'express';
import {
  deleteOrder,
  getAllOrders,
  getSingleOrder,
  myOrders,
  updateOrder,
} from '../controllers/orderController.js';
import {
  authorizeRoles,
  isAuthenticated,
} from '../middlewares/authenticate.js';

const router = express.Router();
// Get Logged in User Orders
router.get('/orders/me', isAuthenticated, myOrders);

// Get Single Order
router.get('/orders/:id', isAuthenticated, getSingleOrder);

// Get All Orders -- Admin
router.get(
  '/admin/orders',
  isAuthenticated,
  authorizeRoles('admin'),
  getAllOrders
);

// Update Order Status -- Admin
router.put(
  '/admin/orders/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  updateOrder
);

// Delete Order -- Admin
router.delete(
  '/admin/orders/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  deleteOrder
);

export default router;
