import Cart from "../models/Cart.js";
import User from "../models/User.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { catchAsync } from "../utils/catchAsync.js";

export const checkout = catchAsync(async (req, res, next) => {
  const { userId, shippingInfo } = req.body;

  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  const user = await User.findById(userId);
  const cart = await Cart.findOne({ user: userId });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (!cart || cart.items.length === 0) {
    return next(new ErrorHandler("No items in cart", 400));
  }

  const finalShippingInfo = shippingInfo || user.shippingInfo;

  if (!finalShippingInfo) {
    return res.status(400).json({
      success: false,
      message: "Shipping info required",
      needShippingInfo: true,
    });
  }

  const { items, total, tax, shipping } = cart;

  res.status(200).json({
    success: true,
    checkoutData: {
      shippingInfo: finalShippingInfo,
      items,
      total,
      tax,
      shipping,
    },
  });
});
