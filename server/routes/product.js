import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  createReview,
  getProductReviews,
  deleteReview,
  getTotalProducts,
} from "../controllers/productController.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/authenticate.js";
import { uploadProductImage } from "../middlewares/image.config.js";

const router = express.Router();

// Product routes
router.post(
  "/products",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadProductImage.array("images", 8),
  createProduct
);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.put(
  "/products/:id",
  isAuthenticated,
  uploadProductImage.array("images", 8),
  authorizeRoles("admin"),
  updateProduct
);
router.delete(
  "/products/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteProduct
);

router.get(
  "/admin/products/count",
  isAuthenticated,
  authorizeRoles("admin"),
  getTotalProducts
);

// Review routes
router.put("/products/:id/reviews", isAuthenticated, createReview);
router.delete("/products/:id/reviews", isAuthenticated, deleteReview);
router.get("/products/:id/reviews", getProductReviews);

export default router;
