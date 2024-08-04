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
router.post("/order/new", isAuthenticated, createOrder);

// Get Logged in User Orders
router.get("/order/me", isAuthenticated, myOrders);

// Get Single Order
router.get("/order/:id", isAuthenticated, getSingleOrder);

// Get All Orders -- Admin
router.get(
  "/admin/orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);

// Update Order Status -- Admin
router.put(
  "/admin/order/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateOrder
);

// Delete Order -- Admin
router.delete(
  "/admin/order/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteOrder
);

export default router;
