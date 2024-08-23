// controllers/subcategoryController.js
import Subcategory from "../models/SubCategory.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createSubcategory = catchAsync(async (req, res, next) => {
  const { name, category, description } = req.body;

  const subcategory = await Subcategory.create({ name, category, description });

  res.status(201).json({
    success: true,
    subcategory,
  });
});

export const getAllSubcategories = catchAsync(async (req, res, next) => {
  const subcategories = await Subcategory.find().populate("category");

  res.status(200).json({
    success: true,
    count: subcategories.length,
    subcategories,
  });
});

export const getSubcategoriesByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  const subcategories = await Subcategory.find({ category: categoryId });

  res.status(200).json({
    success: true,
    subcategories,
  });
});

export const getSubcategoryById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  const subcategory = await Subcategory.findById(id).populate("category");
  if (!subcategory) {
    return next(new ErrorHandler("Subcategory not found", 404));
  }

  res.status(200).json({
    success: true,
    subcategory,
  });
});

export const updateSubcategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, category, description } = req.body;

  const subcategory = await Subcategory.findByIdAndUpdate(
    id,
    { name, category, description },
    { new: true, runValidators: true }
  );

  if (!subcategory) {
    return next(new ErrorHandler("Subcategory not found", 404));
  }

  res.status(200).json({
    success: true,
    subcategory,
  });
});

// Delete a subcategory
export const deleteSubcategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const subcategory = await Subcategory.findByIdAndDelete(id);

  if (!subcategory) {
    return next(new ErrorHandler("Subcategory not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Subcategory deleted successfully",
  });
});
