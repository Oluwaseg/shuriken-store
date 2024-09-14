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
  createSubcategory,
  getAllSubcategories,
  getSubcategoriesByCategory,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
} from "../controllers/subcategoryController.js";
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

router.post(
  "/subcategory",
  createSubcategory,
  isAuthenticated,
  authorizeRoles("admin")
);

router.get("/subcategories", getAllSubcategories);

router.get("/subcategories/:categoryId", getSubcategoriesByCategory);

router.get("/subcategory/:id", getSubcategoryById);

router.put(
  "/subcategory/:id",
  updateSubcategory,
  isAuthenticated,
  authorizeRoles("admin")
);

router.delete(
  "/subcategory/:id",
  deleteSubcategory,
  isAuthenticated,
  authorizeRoles("admin")
);

export default router;
