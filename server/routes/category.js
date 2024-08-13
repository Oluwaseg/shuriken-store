import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoriesWithProductCount,
} from "../controllers/categoryController.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/authenticate.js";

const router = express.Router();

router.post(
  "/category",
  isAuthenticated,
  authorizeRoles("admin"),
  createCategory
);
router.get("/category", getAllCategories);
router.get("/categories", getCategoriesWithProductCount);
router.get("/category/:id", getCategoryById);
router.put(
  "/category/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateCategory
);
router.delete(
  "/category/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCategory
);

export default router;
