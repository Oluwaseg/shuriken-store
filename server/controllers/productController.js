import cloudinary from 'cloudinary';
import { io } from '../bin/www';
import Activity from '../models/Activity.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Subcategory from '../models/SubCategory.js';
import APIFeatures from '../utils/apiFeatures.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ErrorHandler } from '../utils/errorHandler.js';

export const createProduct = catchAsync(async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      subcategory,
      brand,
      bestSeller,
      discount,
      flashSale,
    } = req.body;

    // Validate category
    const validCategory = await Category.findById(category);
    if (!validCategory) {
      return next(new ErrorHandler('Invalid category selected', 400));
    }

    // Validate subcategory if provided
    if (subcategory) {
      const validSubcategory = await Subcategory.findById(subcategory);
      if (
        !validSubcategory ||
        validSubcategory.category.toString() !== category
      ) {
        return next(
          new ErrorHandler('Invalid or mismatched subcategory selected', 400)
        );
      }
    }

    // Validate flash sale
    if (flashSale?.isFlashSale) {
      if (!flashSale.flashSaleEndTime) {
        return next(new ErrorHandler('Flash sale end time is required', 400));
      }
      if (new Date(flashSale.flashSaleEndTime) <= new Date()) {
        return next(
          new ErrorHandler('Flash sale end time must be in the future', 400)
        );
      }
    }

    // Prepare images if provided
    const images =
      req.files?.map((file) => ({
        url: file.path,
        public_id: file.filename,
      })) || [];

    // Construct product data
    const productData = {
      name,
      description,
      price,
      stock,
      category,
      subcategory,
      brand,
      bestSeller,
      discount: discount || { isDiscounted: false, discountPercent: 0 },
      flashSale: flashSale || { isFlashSale: false },
      images,
      user: req.user.id,
    };

    // Create product
    const product = await Product.create(productData);

    // Log activity
    await Activity.create({
      action: 'create',
      product: product._id,
      user: req.user.id,
      activity: `Created a new product: ${product.name}`,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
});

export const updateProduct = catchAsync(async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      subcategory,
      brand,
      bestSeller,
      discount,
      flashSale,
      removeImages = [],
    } = req.body;

    // Validate category if provided
    if (category) {
      const validCategory = await Category.findById(category);
      if (!validCategory) {
        return next(new ErrorHandler('Invalid category selected', 400));
      }
    }

    // Validate subcategory if provided
    if (subcategory) {
      const validSubcategory = await Subcategory.findById(subcategory);
      if (
        !validSubcategory ||
        validSubcategory.category.toString() !== category
      ) {
        return next(
          new ErrorHandler('Invalid or mismatched subcategory selected', 400)
        );
      }
    }

    // Validate flash sale
    if (flashSale?.isFlashSale) {
      if (!flashSale.flashSaleEndTime) {
        return next(new ErrorHandler('Flash sale end time is required', 400));
      }
      if (new Date(flashSale.flashSaleEndTime) <= new Date()) {
        return next(
          new ErrorHandler('Flash sale end time must be in the future', 400)
        );
      }
    }

    // Fetch product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    // Handle image removal
    let removeImageArray = Array.isArray(removeImages)
      ? removeImages
      : [removeImages];

    if (removeImageArray.length > 0) {
      await Promise.all(
        removeImageArray.map(async (imageUrl) => {
          try {
            const public_id = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.v2.uploader.destroy(public_id);
          } catch (err) {
            console.error('Error Deleting Cloudinary Image:', err);
          }
        })
      );
    }

    // Handle new images
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    // Prepare updated data
    const updatedImages = [
      ...product.images.filter((img) => !removeImages.includes(img.url)),
      ...newImages,
    ];
    const updatedData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price }),
      ...(stock && { stock }),
      ...(category && { category }),
      ...(subcategory && { subcategory }),
      ...(brand && { brand }),
      ...(typeof bestSeller !== 'undefined' && { bestSeller }),
      discount: discount || product.discount,
      flashSale: flashSale || product.flashSale,
      images: updatedImages,
    };

    // Recalculate discount price if applicable
    if (
      updatedData.discount.isDiscounted &&
      updatedData.discount.discountPercent
    ) {
      updatedData.discount.discountedPrice =
        updatedData.price * (1 - updatedData.discount.discountPercent / 100);
    } else {
      updatedData.discount.discountedPrice = updatedData.price;
    }

    // Update product in database
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
      return next(new ErrorHandler('Product not found after update', 404));
    }

    // Log activity
    await Activity.create({
      action: 'update',
      product: updatedProduct._id,
      user: req.user.id,
      activity: `Updated product: ${updatedProduct.name}`,
    });

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
});

export const getRecentActivities = catchAsync(async (req, res, next) => {
  try {
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('product', 'name images price')
      .populate('user', 'name email avatar');

    res.status(200).json({
      success: true,
      count: activities.length,
      activities,
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

export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  await Activity.create({
    action: 'delete',
    product: product._id,
    user: req.user.id,
    activity: `Deleted product: ${product.name}`,
  });

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
    await product.populate('reviews.user', 'name email avatar');

    // Emit the updated review to connected clients
    console.log('Emitting updateReview for product:', productId);

    io.emit('updateReview', {
      productId,
      review: existingReview,
    });

    await Activity.create({
      action: 'update',
      product: product._id,
      user: userId,
      activity: `Updated review for product: ${product.name}`,
    });

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

    console.log('Emitting newReview for product:', productId);
    io.emit('newReview', {
      productId,
      review: newReview,
    });

    await Activity.create({
      action: 'create',
      product: product._id,
      user: userId,
      activity: `Added a review for product: ${product.name}`,
    });

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

  await Activity.create({
    action: 'delete',
    product: product._id,
    user: userId,
    activity: `Deleted a review for product: ${product.name}`,
  });

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

  await Activity.create({
    action: 'view',
    product: product._id,
    user: req.user.id,
    activity: `Viewed reviews for product: ${product.name}`,
  });

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
