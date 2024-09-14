import express from "express";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/authenticate.js";
import {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();
router.post("/orders/new", isAuthenticated, createOrder);

// Get Logged in User Orders
router.get("/orders/me", isAuthenticated, myOrders);

// Get Single Order
router.get("/orders/:id", isAuthenticated, getSingleOrder);

// Get All Orders -- Admin
router.get(
  "/admin/orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);

// Update Order Status -- Admin
router.put(
  "/admin/orders/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateOrder
);

// Delete Order -- Admin
router.delete(
  "/admin/orders/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteOrder
);

export default router;
