import { ErrorHandler } from "../utils/errorHandler.js";
import { catchAsync } from "../utils/catchAsync.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const createCategory = catchAsync(async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
});

export const getCategoriesWithProductCount = catchAsync(
  async (req, res, next) => {
    const categories = await Category.find();

    const categoryProductCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
        });
        return {
          ...category._doc,
          productCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categoryProductCounts.length,
      categories: categoryProductCounts,
    });
  }
);

export const getCategoryById = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  res.status(200).json({
    success: true,
    category,
  });
});

export const updateCategory = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true, runValidators: true }
  );

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  res.status(200).json({
    success: true,
    category,
  });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
