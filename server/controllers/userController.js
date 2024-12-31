import crypto from 'crypto';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ErrorHandler } from '../utils/errorHandler.js';
import { sendToken } from '../utils/jwtToken.js';
import {
  sendOTP,
  sendPasswordReset,
  sendPasswordResetSuccess,
  sendWelcomeEmail,
} from '../utils/sendEmail.js';

export const createUser = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { name, email, password, role } = req.body;

  // Validate inputs
  if (!name || !email || !password) {
    return next(
      new ErrorHandler('Name, email, and password are required', 400)
    );
  }

  // Check for password requirements (6+ chars, at least one number and letter)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!passwordRegex.test(password)) {
    return next(
      new ErrorHandler(
        'Password must be at least 6 characters long and include at least one letter and one number',
        400
      )
    );
  }

  // Default user role to 'user' if not provided
  const userRole = role || 'user';

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler('User with this email already exists', 400));
  }

  // Create the user
  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
  });

  try {
    await sendWelcomeEmail(user);
  } catch (error) {
    return next(
      new ErrorHandler(
        "User created successfully, but email couldn't be sent",
        500
      )
    );
  }

  res.status(201).json({
    success: true,
    message: 'User created successfully, email sent successfully',
    user,
  });
});

export const createAdmin = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (req.user.role !== 'admin') {
    return next(new ErrorHandler('Unauthorized to perform this action', 403));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler('User with this email already exists', 400));
  }

  const admin = await User.create({
    name,
    email,
    password,
    role: 'admin',
  });

  res.status(201).json({
    success: true,
    message: 'Admin created successfully',
    admin,
  });
});

export const register = catchAsync(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ErrorHandler('All fields are required!', 400);
    }

    if (password.length < 6) {
      throw new ErrorHandler(
        'Password must be at least 6 characters long!',
        400
      );
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      throw new ErrorHandler(
        'Password must contain at least one letter and one number!',
        400
      );
    }

    const defaultAvatar = {
      public_id: 'default_avatar',
      url: 'https://res.cloudinary.com/djc5o8g94/image/upload/v1721652090/shop/ewzndt3avjd1fv7hwft6.jpg',
    };

    let avatar = defaultAvatar;

    if (req.file) {
      avatar = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    } else {
      console.log('No file received, using default avatar.');
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar,
    });

    await sendOTP(user);

    res.status(201).json({
      success: true,
      message:
        'Registration successful!,  Please check your email and use the OTP to verify your account.',
    });
  } catch (error) {
    next(error);
  }
});

export const verifyOTP = catchAsync(async (req, res, next) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      throw new ErrorHandler('OTP is required!', 400);
    }

    const user = await User.findOne({
      otp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ErrorHandler('Invalid or expired OTP', 400);
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    await sendWelcomeEmail(user);

    sendToken(user, 200, res, 'User verified successfully');
  } catch (error) {
    next(error);
  }
});

export const resendOTP = catchAsync(async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    if (user.isVerified) {
      throw new ErrorHandler('User already verified', 400);
    }

    await sendOTP(user);

    res.status(200).json({
      success: true,
      message: 'A new OTP has been sent to your email address.',
    });
  } catch (error) {
    next(error);
  }
});

export const userLogin = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ErrorHandler('Please Enter Email & Password', 400);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      throw new ErrorHandler('Invalid email or password', 401);
    }

    if (!user.isVerified) {
      throw new ErrorHandler(
        'User not verified. Please verify your email address.',
        400
      );
    }

    sendToken(user, 200, res, 'User logged in successfully');
  } catch (error) {
    next(error);
  }
});

export const adminLogin = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ErrorHandler('Please Enter Email & Password', 400);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    if (user.role !== 'admin') {
      throw new ErrorHandler('Not authorized as admin', 403);
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      throw new ErrorHandler('Invalid email or password', 401);
    }

    sendToken(user, 200, res, 'Admin logged in successfully');
  } catch (error) {
    next(error);
  }
});

export const logout = catchAsync(async (req, res, next) => {
  try {
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    });

    res.status(200).json({
      success: true,
      message: 'Logged Out',
    });
  } catch (error) {
    next(error);
  }
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendPasswordReset(user, resetUrl);

    res.status(200).json({
      success: true,
      message: `Password reset email sent to: ${user.email}`,
    });
  } catch (error) {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }
    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorHandler('Password reset token is invalid or has expired', 400)
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler('Passwords do not match', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    await sendPasswordResetSuccess(user);

    sendToken(user, 200, res, 'Password updated successfully');
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const getUserDetails = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const updateUserPassword = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      return next(new ErrorHandler('Password is incorrect', 401));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler('Passwords do not match', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res, 'Password updated successfully');
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const deleteOldAvatar = async (public_id) => {
  if (public_id && public_id !== 'default_avatar') {
    await cloudinary.v2.uploader.destroy(public_id);
  }
};

export const updateProfile = catchAsync(async (req, res, next) => {
  try {
    const newUserData = {};

    if (req.body.name) newUserData.name = req.body.name;
    if (req.body.email) newUserData.email = req.body.email;
    if (req.body.bio) newUserData.bio = req.body.bio;
    if (req.body.birthday) newUserData.birthday = req.body.birthday;
    if (req.body.username) newUserData.username = req.body.username;

    if (req.body.shippingInfo) {
      newUserData.shippingInfo = {
        address: req.body.shippingInfo.address,
        city: req.body.shippingInfo.city,
        state: req.body.shippingInfo.state,
        country: req.body.shippingInfo.country,
        postalCode: req.body.shippingInfo.postalCode,
        phoneNo: req.body.shippingInfo.phoneNo,
      };
    }

    if (req.file) {
      const newAvatar = {
        public_id: req.file.filename,
        url: req.file.path,
      };

      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }

      if (user.avatar && user.avatar.public_id !== 'default_avatar') {
        try {
          await deleteOldAvatar(user.avatar.public_id);
        } catch (error) {
          return next(new ErrorHandler('Failed to delete old avatar', 500));
        }
      }

      newUserData.avatar = newAvatar;
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Profile Updated Successfully',
      user,
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to update profile', 500));
  }
});

// GET all users (admin)
export const getAllUsers = catchAsync(async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to fetch users', 500));
  }
});

// GET single user (admin)
export const getSingleUser = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to fetch user', 500));
  }
});

// Update User Role -- Admin
export const updateUserRole = catchAsync(async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!user) {
      return next(
        new ErrorHandler(`User not found with Id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to update user role', 500));
  }
});

// Delete User -- Admin
export const deleteUser = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with id: ${req.params.id}`, 404)
      );
    }

    await Order.deleteMany({ user: req.params.id });

    await Cart.deleteMany({ user: req.params.id });

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message:
        'User and all associated orders and cart items deleted successfully',
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const updateUserShippingInfo = catchAsync(async (req, res, next) => {
  try {
    const { userId, shippingInfo } = req.body;

    if (!shippingInfo || !userId) {
      return next(
        new ErrorHandler('User ID and shipping info are required', 400)
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { shippingInfo },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Shipping info updated successfully',
      user,
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to update shipping info', 500));
  }
});

export const activeUsers = {};
