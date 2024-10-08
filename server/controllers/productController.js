import cloudinary from 'cloudinary';
import Product from '../models/Product.js';
import APIFeatures from '../utils/apiFeatures.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ErrorHandler } from '../utils/errorHandler.js';

export const createProduct = catchAsync(async (req, res, next) => {
  try {
    console.log(req.body);

    const productData = { ...req.body };

    if (productData.flashSale && productData.flashSale.isFlashSale) {
      if (!productData.flashSale.flashSaleEndTime) {
        return next(new ErrorHandler('Flash sale end time is required', 400));
      }

      if (new Date(productData.flashSale.flashSaleEndTime) <= new Date()) {
        return next(
          new ErrorHandler('Flash sale end time must be in the future', 400)
        );
      }
    }

    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    productData.user = req.user.id;

    const product = await Product.create(productData);

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
    return next(new ErrorHandler('Product not found', 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

export const getRelatedProducts = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }
  const relatedProduct = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  })
    .limit(4)
    .exec();
  res.status(200).json({
    success: true,
    relatedProduct,
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  console.log(req.body);

  const remove_images = req.body.remove_images || [];

  if (remove_images.length > 0) {
    await Promise.all(
      remove_images.map(async (imageUrl) => {
        const public_id = imageUrl.split('/').pop().split('.')[0];
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
    return next(new ErrorHandler('Product not found', 404));
  }

  if (req.body.flashSale && req.body.flashSale.isFlashSale) {
    if (!req.body.flashSale.flashSaleEndTime) {
      return next(new ErrorHandler('Flash sale end time is required', 400));
    }

    if (new Date(req.body.flashSale.flashSaleEndTime) <= new Date()) {
      return next(
        new ErrorHandler('Flash sale end time must be in the future', 400)
      );
    }
  }

  const updatedData = {
    ...req.body,
    images: [
      ...product.images.filter((img) => !remove_images.includes(img.url)),
      ...newImages,
    ],
  };

  if (updatedData.discount) {
    if (
      updatedData.discount.isDiscounted &&
      updatedData.discount.discountPercent
    ) {
      updatedData.discount.discountedPrice =
        updatedData.price * (1 - updatedData.discount.discountPercent / 100);
    } else {
      updatedData.discount.discountedPrice = updatedData.price;
    }
  }

  if (updatedData.flashSale) {
    if (
      updatedData.flashSale.isFlashSale &&
      updatedData.flashSale.flashSalePrice
    ) {
      updatedData.flashSale.flashSalePrice =
        updatedData.flashSale.flashSalePrice;
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updatedData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  if (!updatedProduct) {
    return next(new ErrorHandler('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    product: updatedProduct,
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }
  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

export const createReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;
  const userId = req.user.id;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const existingReview = product.reviews.find(
    (review) => review.user.toString() === userId.toString()
  );

  if (existingReview) {
    // Update existing review
    existingReview.rating = rating;
    existingReview.comment = comment;

    product.ratings =
      product.reviews.reduce((acc, review) => review.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    // Populate user details in the updated review
    await product.populate('reviews.user', 'name email avatar'); // Adjust fields as needed

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review: existingReview,
    });
  } else {
    // Add new review
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

    // Populate user details in the new review
    await product.populate('reviews.user', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: newReview,
    });
  }
});

export const deleteReview = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user.id;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const reviewIndex = product.reviews.findIndex(
    (review) =>
      review.user.toString() === userId.toString() || req.user.role === 'admin' // Allow admin to delete any review
  );

  if (reviewIndex === -1) {
    return next(new ErrorHandler('Review not found', 404));
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
    message: 'Review deleted successfully',
  });
});

export const getProductReviews = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  // Populate user details in the reviews
  await product.populate('reviews.user', 'name email avatar');

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
