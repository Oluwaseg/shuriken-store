import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createOrder = catchAsync(async (req, res, next) => {
  const { userId, shippingInfo } = req.body;

  // Fetch the cart and user
  const cart = await Cart.findOne({ user: userId });
  const user = await User.findById(userId);

  if (!cart || !user) {
    return next(new ErrorHandler("Cart or user not found", 404));
  }

  // Use the shipping info from the user model if not provided
  const finalShippingInfo = shippingInfo || user.shippingInfo;

  // Create an order
  const order = await Order.create({
    user: userId,
    orderItems: cart.items,
    shippingInfo: finalShippingInfo,
    itemsPrice: cart.total,
    taxPrice: cart.tax,
    shippingPrice: cart.shipping,
    totalPrice: cart.total + cart.tax + cart.shipping,
    orderStatus: "Pending",
  });

  const populatedOrder = await Order.findById(order._id)
    .populate("user", "name email avatar")
    .exec();

  res.status(201).json({
    success: true,
    order: populatedOrder,
    message: "Order created successfully. Proceed to payment.",
  });
});
// Get Single Order
export const getSingleOrder = catchAsync(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email avatar"
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
    const orders = await Order.find()
      .populate("user", "name email avatar")
      .exec();

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

// Update order status -- Admin
export const updateOrder = catchAsync(async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    // Fetch the order
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }

    // Define allowed status transitions
    const allowedTransitions = {
      Pending: ["Processing", "Cancelled"],
      Processing: ["Shipped", "Pending"],
      Shipped: ["Delivered", "Processing"],
      Delivered: ["Returned"],
      Cancelled: [],
    };

    // Check if the transition is allowed
    if (!allowedTransitions[order.orderStatus]?.includes(status)) {
      return next(
        new ErrorHandler(
          `Invalid status transition from ${order.orderStatus} to ${status}`,
          400
        )
      );
    }

    // Handle stock updates if transitioning to "Shipped" or reverting from "Delivered"
    if (status === "Shipped" && order.orderStatus === "Processing") {
      await Promise.all(
        order.orderItems.map((item) => updateStock(item.product, item.quantity))
      );
    } else if (status === "Processing" && order.orderStatus === "Shipped") {
      // Optional: handle restocking if needed
      await Promise.all(
        order.orderItems.map((item) =>
          updateStock(item.product, -item.quantity)
        )
      );
    }

    // Update order status and relevant fields
    order.orderStatus = status;
    if (status === "Delivered") order.deliveredAt = Date.now();
    if (status === "Shipped" && order.orderStatus === "Processing")
      order.shippedAt = Date.now();
    if (status === "Processing" && order.orderStatus === "Pending")
      order.processingAt = Date.now();

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    next(new ErrorHandler(error.message, 500));
  }
});

async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ErrorHandler("Product not found", 404);
  }
  product.stock -= quantity;
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
