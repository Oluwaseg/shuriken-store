import Cart from '../models/Cart.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ErrorHandler } from '../utils/errorHandler.js';

export const checkout = catchAsync(async (req, res, next) => {
  const { userId, shippingInfo } = req.body;

  if (!userId) {
    return next(new ErrorHandler('User ID is required', 400));
  }

  const user = await User.findById(userId);
  const cart = await Cart.findOne({ user: userId });

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  if (!cart || cart.items.length === 0) {
    return next(new ErrorHandler('No items in cart', 400));
  }

  // Validate shipping info from request body
  if (
    !shippingInfo ||
    !shippingInfo.address ||
    !shippingInfo.city ||
    !shippingInfo.state ||
    !shippingInfo.country ||
    !shippingInfo.postalCode ||
    !shippingInfo.phoneNo
  ) {
    return res.status(400).json({
      success: false,
      message: 'Complete shipping information is required',
      needShippingInfo: true,
    });
  }

  // Update user's shipping info permanently if provided in checkout
  user.shippingInfo = shippingInfo;
  await user.save();

  // Send checkout data back to the client
  const { items, total, tax, shipping } = cart;

  res.status(200).json({
    success: true,
    checkoutData: {
      shippingInfo,
      items,
      total,
      tax,
      shipping,
    },
  });
});
