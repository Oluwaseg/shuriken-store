import crypto from 'crypto';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ErrorHandler } from '../utils/errorHandler.js';
import { sendToken } from '../utils/jwtToken.js';
import { sendEmail, sendOTP, sendWelcomeEmail } from '../utils/sendEmail.js';

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

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
      'Registration successful! A verification email has been sent to your address with a one-time password (OTP). Please check your email and use the OTP to verify your account. The OTP will expire in 10 minutes.',
  });
});

export const verifyOTP = catchAsync(async (req, res, next) => {
  const { otp } = req.body;

  const user = await User.findOne({
    otp,
    otpExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler('Invalid or expired OTP', 400));
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save();

  await sendWelcomeEmail(user);

  sendToken(user, 200, res);
});

export const resendOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  if (user.isVerified) {
    return next(new ErrorHandler('User already verified', 400));
  }

  await sendOTP(user);

  res.status(200).json({
    success: true,
    message: 'A new OTP has been sent to your email address.',
  });
});

export const userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please Enter Email & Password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  if (!user.isVerified) {
    return next(
      new ErrorHandler(
        'User not verified. Please verify your email address.',
        400
      )
    );
  }

  sendToken(user, 200, res);
});
export const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please Enter Email & Password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  if (user.role !== 'admin') {
    return next(new ErrorHandler('Not authorized as admin', 403));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  sendToken(user, 200, res);
});

export const logout = catchAsync(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged Out',
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const message = `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <tr>
          <td style="background-color: #007bff; color: #fff; padding: 10px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1>ShopIT Password Recovery</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <p>Hi ${user.name},</p>
            <p>We received a request to reset your password. Click the link below to set a new password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff !important; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ddd;">
            <p>If the button above does not work, you can copy and paste the following URL into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>If you did not request this password reset, please ignore this email.</p>
            <p>Thank you,<br>The ShopIT Team</p>
          </td>
        </tr>
        <tr>
          <td style="text-align: center; padding: 10px; font-size: 12px; color: #888;">
            <p>&copy; ${new Date().getFullYear()} ShopIT. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'ShopIT Password Recovery',
      html: message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
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
      new ErrorHandler(
        'Password reset token is invalid or has been expired',
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

export const getUserDetails = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateUserPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

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
});

const deleteOldAvatar = async (public_id) => {
  if (public_id && public_id !== 'default_avatar') {
    await cloudinary.v2.uploader.destroy(public_id);
  }
};

// export const updateProfile = catchAsync(async (req, res, next) => {
//   const newUserData = {};

//   if (req.body.name) newUserData.name = req.body.name;
//   if (req.body.email) newUserData.email = req.body.email;

//   if (req.file) {
//     const newAvatar = {
//       public_id: req.file.filename,
//       url: req.file.path,
//     };

//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return next(new ErrorHandler('User not found', 404));
//     }

//     if (user.avatar && user.avatar.public_id !== 'default_avatar') {
//       await deleteOldAvatar(user.avatar.public_id);
//     }

//     newUserData.avatar = newAvatar;
//   }

//   const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   if (!user) {
//     return next(new ErrorHandler('User not found', 404));
//   }

//   res.status(200).json({
//     success: true,
//     message: 'Profile Updated Successfully',
//     user,
//   });
// });

export const updateProfile = catchAsync(async (req, res, next) => {
  try {
    console.log(req.body);
    const newUserData = {};

    // Update basic fields
    if (req.body.name) newUserData.name = req.body.name;
    if (req.body.email) newUserData.email = req.body.email;
    if (req.body.bio) newUserData.bio = req.body.bio;
    if (req.body.birthday) newUserData.birthday = req.body.birthday;
    if (req.body.username) newUserData.username = req.body.username;

    // Shipping info update
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

    // Avatar update
    if (req.file) {
      console.log(req.file);
      const newAvatar = {
        public_id: req.file.filename,
        url: req.file.path,
      };

      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }

      // Delete old avatar if it's not the default
      if (user.avatar && user.avatar.public_id !== 'default_avatar') {
        try {
          await deleteOldAvatar(user.avatar.public_id);
          console.log('Old avatar deleted successfully'); // Debugging
        } catch (error) {
          console.error('Error deleting old avatar: ', error);
          return next(new ErrorHandler('Failed to delete old avatar', 500));
        }
      }

      newUserData.avatar = newAvatar;
    }

    // Update user in DB
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
    return next(new ErrorHandler('Failed to update profile', 500)); // Handle uncaught errors gracefully
  }
});

// GET all users (admin)
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// GET single user (admin)
export const getSingleUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Role -- Admin
export const updateUserRole = catchAsync(async (req, res, next) => {
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
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    newUserData,
  });
});

// Delete User -- Admin
// export const deleteUser = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     return next(
//       new ErrorHandler(`User does not exist with id: ${req.params.id}`, 404)
//     );
//   }

//   // Remove user from database
//   await User.findByIdAndDelete(req.params.id);

//   res.status(200).json({
//     success: true,
//     message: "User deleted successfully",
//   });
// });

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
  const { userId, shippingInfo } = req.body;

  if (!shippingInfo || !userId) {
    return next(
      new ErrorHandler('User ID and shipping info are required', 400)
    );
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { shippingInfo },
    { new: true }
  );

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Shipping info updated successfully',
    user,
  });
});
