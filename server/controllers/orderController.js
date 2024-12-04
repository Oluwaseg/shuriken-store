import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ErrorHandler } from '../utils/errorHandler.js';
import { sendOrderStatusUpdate } from '../utils/sendEmail.js';

// Get Single Order
export const getSingleOrder = catchAsync(async (req, res, next) => {
  try {
    const orders = await Order.findById(req.params.id).populate(
      'user',
      'name email avatar'
    );

    if (!orders) {
      return next(new ErrorHandler('Order not found with this Id', 404));
    }

    res.status(200).json({
      success: true,
      orders,
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
      .populate('user', 'name email avatar')
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

    // Fetch the order and populate the user and shipping info fields
    const order = await Order.findById(orderId).populate(
      'user',
      'name email avatar'
    );
    if (!order) {
      return next(new ErrorHandler('Order not found with this Id', 404));
    }

    // Log the current and attempted status to debug the issue
    console.log('Current order status:', order.orderStatus);
    console.log('Attempted transition to:', status);

    // If the status is already the same, return early
    if (order.orderStatus === status) {
      return res.status(200).json({
        success: true,
        message: `Order is already in the '${status}' status.`,
        order,
      });
    }

    // Define allowed status transitions
    const allowedTransitions = {
      Pending: ['Processing', 'Cancelled'],
      Processing: ['Packaging', 'Shipped', 'Pending'],
      Packaging: ['Shipped', 'Processing'],
      Shipped: ['Delivered', 'Processing'],
      Delivered: ['Returned'],
      Cancelled: [],
    };

    // Check if the attempted transition is allowed
    if (!allowedTransitions[order.orderStatus]?.includes(status)) {
      return next(
        new ErrorHandler(
          `Invalid status transition from ${order.orderStatus} to ${status}`,
          400
        )
      );
    }

    let customMessage = null;

    // Handle stock updates if transitioning to "Shipped" or reverting from "Delivered"
    if (status === 'Shipped' && order.orderStatus === 'Processing') {
      await Promise.all(
        order.orderItems.map((item) => updateStock(item.product, item.quantity))
      );
    } else if (status === 'Processing' && order.orderStatus === 'Shipped') {
      await Promise.all(
        order.orderItems.map((item) =>
          updateStock(item.product, -item.quantity)
        )
      );
      customMessage = 'Your order has been reverted to processing.';
    }

    // Update order status and relevant fields
    order.orderStatus = status;
    if (status === 'Delivered') order.deliveredAt = Date.now();
    if (status === 'Shipped' && order.orderStatus === 'Processing')
      order.shippedAt = Date.now();
    if (status === 'Processing' && order.orderStatus === 'Pending')
      order.processingAt = Date.now();
    if (status === 'Packaging' && order.orderStatus === 'Processing')
      order.packagingAt = Date.now();

    await order.save({ validateBeforeSave: false });

    await sendOrderStatusUpdate(order.user, order, customMessage);

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    next(new ErrorHandler(error.message, 500));
  }
});

async function updateStock(productId, quantity) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ErrorHandler('Product not found', 404);
    }
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
    console.log(
      `Stock updated for product ${product.name}. New stock: ${product.stock}`
    );
  } catch (error) {}
}

// delete order -- Admin
export const deleteOrder = catchAsync(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler('Order not found with this Id', 404));
    }
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      order,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
