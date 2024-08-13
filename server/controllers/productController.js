import cloudinary from "cloudinary";
import Product from "../models/Product.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { catchAsync } from "../utils/catchAsync.js";
import APIFeatures from "../utils/apiFeatures.js";

export const createProduct = catchAsync(async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const images = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    const product = await Product.create({
      ...req.body,
      images: images,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
});

export const getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .search()
    .limitFields()
    .paginate();
  const products = await features.query;
  res.status(200).json({
    success: true,
    result: products.length,
    products,
  });
});

export const getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const remove_images = req.body.remove_images || [];

  if (remove_images.length > 0) {
    await Promise.all(
      remove_images.map(async (imageUrl) => {
        const public_id = imageUrl.split("/").pop().split(".")[0];
        await cloudinary.v2.uploader.destroy(public_id);
      })
    );
  }

  let newImages = [];
  if (req.files && req.files.length > 0) {
    newImages = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const filteredImages = product.images.filter(
    (img) => !remove_images.includes(img.url)
  );

  const updatedImages = [...filteredImages, ...newImages];

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      images: updatedImages,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  if (!updatedProduct) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product: updatedProduct,
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const createReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;
  const userId = req.user.id;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const existingReview = product.reviews.find(
    (review) => review.user.toString() === userId.toString()
  );

  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
    const updatedReview = existingReview;
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } else {
    const newReview = {
      name: req.user.name,
      rating,
      comment,
      user: userId,
    };
    product.reviews.push(newReview);

    product.numOfReviews = product.reviews.length;
    product.ratings =
      product.reviews.reduce((acc, review) => review.rating + acc, 0) /
      product.numOfReviews;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview,
    });
  }
});

export const deleteReview = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user.id;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviewIndex = product.reviews.findIndex(
    (review) => review.user.toString() === userId.toString()
  );
  if (reviewIndex === -1) {
    return next(new ErrorHandler("Review not found", 404));
  }

  product.reviews.splice(reviewIndex, 1);

  product.numOfReviews = product.reviews.length;
  product.ratings =
    product.numOfReviews === 0
      ? 0
      : product.reviews.reduce((acc, review) => review.rating + acc, 0) /
        product.numOfReviews;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

export const getProductReviews = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

export const getTotalProducts = catchAsync(async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
