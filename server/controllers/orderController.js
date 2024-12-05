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

async function updateStock(productId, quantity) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return new Error(`Product not found: ${productId}`);
    }

    // Calculate new stock
    const newStock = product.stock - quantity;
    if (newStock < 0) {
      return new Error(`Insufficient stock for product: ${product.name}`);
    }

    product.stock = newStock;
    await product.save({ validateBeforeSave: false });
  } catch (error) {
    console.error('Error in updateStock:', error.message);
  }
}

// Update order status -- Admin
export const updateOrder = catchAsync(async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findById(orderId).populate(
      'user',
      'name email avatar'
    );
    if (!order) {
      return next(new ErrorHandler('Order not found with this Id', 404));
    }

    if (order.orderStatus === status) {
      return res.status(200).json({
        success: true,
        message: `Order is already in the '${status}' status.`,
        order,
      });
    }

    const allowedTransitions = {
      Pending: ['Processing', 'Cancelled'],
      Processing: ['Packaging', 'Shipped', 'Pending', 'Cancelled'],
      Packaging: ['Shipped', 'Processing'],
      Shipped: ['Delivered', 'Processing'],
      Delivered: ['Returned'],
      Cancelled: [],
    };

    if (!allowedTransitions[order.orderStatus]?.includes(status)) {
      return next(
        new ErrorHandler(
          `Invalid status transition from ${order.orderStatus} to ${status}`,
          400
        )
      );
    }

    let customMessage = null;

    if (status === 'Packaging' && order.orderStatus === 'Processing') {
    } else if (status === 'Shipped' && order.orderStatus === 'Packaging') {
      console.log('Packaging -> Shipped: Updating stock...');
      await Promise.all(
        order.orderItems.map(async (item) => {
          console.log(
            `Updating stock for product: ${item.product}, Quantity: ${item.quantity}`
          );
          await updateStock(item.product, item.quantity);
        })
      );
    } else if (status === 'Processing' && order.orderStatus === 'Shipped') {
      console.log('Shipped -> Processing: Reverting stock...');
      await Promise.all(
        order.orderItems.map((item) =>
          updateStock(item.product, -item.quantity)
        )
      );
      customMessage = 'Your order has been reverted to processing.';
    }

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

// Cancel Order -- Admin/User
export const cancelOrder = catchAsync(async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId).populate(
      'user',
      'name email avatar'
    );

    if (!order) {
      return next(new ErrorHandler('Order not found with this Id', 404));
    }

    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
      return next(
        new ErrorHandler(
          'Cannot cancel an order that has been shipped or delivered.',
          400
        )
      );
    }

    if (order.orderStatus !== 'Cancelled') {
      await Promise.all(
        order.orderItems.map(async (item) => {
          console.log(
            `Restoring stock for product: ${item.product}, Quantity: ${item.quantity}`
          );
          await updateStock(item.product, -item.quantity);
        })
      );
    }

    order.orderStatus = 'Cancelled';
    order.cancelledAt = Date.now();

    await order.save({ validateBeforeSave: false });

    // Send cancellation email to the user
    await sendOrderStatusUpdate(
      order.user,
      order,
      'Your order has been cancelled.'
    );

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    next(new ErrorHandler(error.message, 500));
  }
});
