import express from 'express';
import {
  createProduct,
  createReview,
  deleteProduct,
  deleteReview,
  getAllProducts,
  getProductById,
  getProductReviews,
  getRecentActivities,
  getRelatedProducts,
  getTotalProducts,
  updateProduct,
} from '../controllers/productController.js';
import {
  authorizeRoles,
  isAuthenticated,
} from '../middlewares/authenticate.js';
import { uploadProductImage } from '../middlewares/image.config.js';
import {
  validateCreateProduct,
  validateUpdateProduct,
} from '../middlewares/validateProduct.js';

const router = express.Router();

// Product routes
router.post(
  '/products',
  isAuthenticated,
  authorizeRoles('admin'),
  uploadProductImage.array('images', 8),
  validateCreateProduct,
  createProduct
);
router.get('/products/activities', getRecentActivities);
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.get('/products/related/:id', getRelatedProducts);
router.put(
  '/products/:id',
  isAuthenticated,
  uploadProductImage.array('images', 8),
  authorizeRoles('admin'),
  validateUpdateProduct,
  updateProduct
);
router.delete(
  '/products/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  deleteProduct
);

router.get(
  '/admin/products/count',
  isAuthenticated,
  authorizeRoles('admin'),
  getTotalProducts
);

// Review routes
router.get('/products/:id/reviews', getProductReviews);
router.put('/products/:id/reviews', isAuthenticated, createReview);
router.delete(
  '/products/:id/reviews',
  isAuthenticated,
  authorizeRoles('admin', 'user'),
  deleteReview
);

export default router;
