import axios from 'axios';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendOrderConfirmation } from '../utils/sendEmail.js';

export const initializePayment = catchAsync(async (req, res, next) => {
  try {
    const { userId, email } = req.body;

    // Fetch the user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ success: false, message: 'Cart is empty' });
    }

    // Fetch user to get shippingInfo
    const user = await User.findById(userId);
    if (!user || !user.shippingInfo) {
      return res
        .status(404)
        .json({ success: false, message: 'User or shipping info not found' });
    }

    const amountInKobo = Math.round(cart.total * 100);

    const data = {
      email,
      amount: amountInKobo,
      callback_url: 'https://b3tfhzw5-3050.uks1.devtunnels.ms/payment-success',
      metadata: {
        userId: user._id,
        shippingInfo: user.shippingInfo,
      },
    };

    const headers = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(
      `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
      data,
      { headers }
    );

    // Create the order with "Pending Verification" status
    const orderItems = cart.items.map((item) => {
      const product = item.product;
      return {
        name: product.name,
        image: product.images.length > 0 ? product.images[0].url : '',
        price: product.price,
        quantity: item.quantity,
        product: product._id,
      };
    });

    const order = await Order.create({
      user: userId,
      orderItems,
      shippingInfo: user.shippingInfo,
      itemsPrice: cart.total,
      taxPrice: cart.tax,
      shippingPrice: cart.shipping,
      totalPrice: cart.total,
      paymentInfo: {
        id: response.data.data.reference,
        status: 'Pending',
      },
      paidAt: Date.now(),
      orderStatus: 'Pending Verification',
    });

    // Optionally, you can clear the cart here if you prefer
    await Cart.findOneAndDelete({ user: userId });

    res.status(200).json({
      success: true,
      data: response.data.data,
      order,
    });
  } catch (error) {
    console.error(
      'Error initializing payment:',
      error.response?.data || error.message
    );
    return res
      .status(500)
      .json({ success: false, message: error.response?.data || error.message });
  }
});

export const verifyPayment = catchAsync(async (req, res, next) => {
  const { reference } = req.params;

  try {
    // Verify payment with Paystack
    const response = await axios.get(
      `${process.env.PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { status, metadata } = response.data.data;

    // Fetch user using metadata.userId
    const user = await User.findById(metadata.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found for this payment.',
      });
    }

    // Validate that the user has an email
    if (!user.email) {
      return res.status(400).json({
        success: false,
        message: 'User email is required to send order confirmation.',
      });
    }

    // Check if an order with this reference already exists
    let order = await Order.findOne({ 'paymentInfo.id': reference });

    if (order) {
      if (status === 'success') {
        order.paymentInfo.status = 'Success';
        order.orderStatus = 'Pending';
        order.paidAt = Date.now();
        await order.save();

        // Clear the user's cart
        await Cart.findOneAndDelete({ user: order.user });

        // Send order confirmation email
        await sendOrderConfirmation(user, order);

        return res.status(200).json({
          success: true,
          message: 'Payment verified successfully',
          order,
        });
      } else {
        order.paymentInfo.status = 'Failed';
        order.orderStatus = 'Payment Failed';
        await order.save();

        return res.status(400).json({
          success: false,
          message: 'Payment verification failed.',
          order,
        });
      }
    }

    // If no order exists, create a new one
    if (status === 'success') {
      const { shippingInfo } = metadata || {};

      if (!shippingInfo) {
        return res.status(400).json({
          success: false,
          message: 'Shipping information is missing.',
        });
      }

      const cart = await Cart.findOne({ user: metadata.userId });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart is empty or already processed.',
        });
      }

      const orderItems = await Promise.all(
        cart.items.map(async (item) => {
          const product = await Product.findById(item.product);
          if (!product) {
            throw new Error(`Product not found for ID: ${item.product}`);
          }

          return {
            name: product.name,
            price: product.price,
            image: product.images[0]?.url || '',
            quantity: item.quantity,
            product: product._id,
          };
        })
      );

      order = await Order.create({
        user: metadata.userId,
        orderItems,
        shippingInfo,
        itemsPrice: cart.total,
        taxPrice: cart.tax,
        shippingPrice: cart.shipping,
        totalPrice: cart.total,
        paymentInfo: { id: reference, status: 'Success' },
        paidAt: Date.now(),
        orderStatus: 'Pending',
      });

      // Clear the user's cart
      await Cart.findOneAndDelete({ user: metadata.userId });

      // Send order confirmation email
      await sendOrderConfirmation(user, order);

      return res.status(201).json({
        success: true,
        message: 'Payment verified and order created successfully',
        order,
      });
    } else {
      order.paymentInfo.status = 'Failed';
      order.orderStatus = 'Payment Failed';
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed.',
        order,
      });
    }
  } catch (error) {
    console.error(
      'Error verifying payment:',
      error.message || error.response?.data
    );
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});
