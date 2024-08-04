import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createOrder = catchAsync(async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    // Validate the required fields
    if (
      !shippingInfo ||
      !orderItems ||
      !paymentInfo ||
      !itemsPrice ||
      !taxPrice ||
      !shippingPrice ||
      !totalPrice
    ) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    // Create the order
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    // Send response
    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

// Get Single Order
export const getSingleOrder = catchAsync(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

// Get Logged in user Orders
export const myOrders = catchAsync(async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

// Get all orders (admin)
export const getAllOrders = catchAsync(async (req, res, next) => {
  try {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      totalAmount,
      orderCount: orders.length,
      orders,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

// update order status -- Admin
export const updateOrder = catchAsync(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
    if (order.orderStatus === "Delivered") {
      return next(
        new ErrorHandler("You have already delivered this order", 400)
      );
    }

    if (req.body.status === "Shipped") {
      order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
      });
    }
    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.Stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// delete order -- Admin
export const deleteOrder = catchAsync(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      order,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
