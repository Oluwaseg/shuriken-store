import axios from "axios";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import { catchAsync } from "../utils/catchAsync.js";
import { PAYSTACK_BASE_URL } from "../config/constants.js"; // Assuming you're using a config file

// Payment Initialization
export const initializePayment = catchAsync(async (req, res, next) => {
  const { orderId, email } = req.body;

  // Fetch the order
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  const amountInKobo = order.totalPrice * 100; // Convert to kobo

  const data = {
    email,
    amount: amountInKobo,
    metadata: {
      orderId, // Pass the order ID to metadata
      userId: order.user,
    },
  };

  const headers = {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const response = await axios.post(
    `${PAYSTACK_BASE_URL}/transaction/initialize`,
    data,
    { headers }
  );

  res.status(200).json(response.data);
});

// Payment Verification
export const verifyPayment = catchAsync(async (req, res, next) => {
  const { reference } = req.params;

  const response = await axios.get(
    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const { status, metadata } = response.data.data;

  if (status === "success") {
    // Create an order from cart and shipping info
    const { userId, shippingInfo } = metadata;
    const cart = await Cart.findOne({ user: userId });
    const order = await Order.create({
      user: userId,
      orderItems: cart.items,
      shippingInfo,
      totalPrice: cart.total,
      paymentInfo: { id: reference, status },
      paidAt: Date.now(),
    });

    // Clear cart after successful payment
    await Cart.findOneAndDelete({ user: userId });

    res.status(200).json({
      success: true,
      message: "Payment verified, order created",
      order,
    });
  }
  if (status !== "success") {
    // Log the failure for debugging purposes (you could use a service like Sentry)
    console.error(
      `Payment failed for reference: ${reference}, status: ${status}`
    );

    return res.status(400).json({
      success: false,
      message: `Payment verification failed with status: ${status}`,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});
