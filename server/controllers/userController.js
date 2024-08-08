import crypto from "crypto";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail, sendOTP, sendWelcomeEmail } from "../utils/sendEmail.js";

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const defaultAvatar = {
    public_id: "default_avatar",
    url: "https://res.cloudinary.com/djc5o8g94/image/upload/v1721652090/shop/ewzndt3avjd1fv7hwft6.jpg",
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
      "Registration successful! A verification email has been sent to your address with a one-time password (OTP). Please check your email and use the OTP to verify your account. The OTP will expire in 10 minutes.",
  });
});

export const verifyOTP = catchAsync(async (req, res, next) => {
  const { otp } = req.body;

  const user = await User.findOne({
    otp,
    otpExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save();

  await sendWelcomeEmail(user);

  sendToken(user, 200, res);
});

export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

export const logout = catchAsync(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/user/password/reset/${resetToken}`;

  const message = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #007bff;
          color: #fff;
          padding: 10px 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          padding: 20px;
        }
        .footer {
          text-align: center;
          padding: 10px;
          font-size: 12px;
          color: #888;
        }
        .btn {
          display: inline-block;
          padding: 10px 20px;
          margin: 20px 0;
          font-size: 16px;
          color: #fff !important;
          background-color: #007bff;
          text-decoration: none;
          border-radius: 5px;
        }
        .btn:hover {
          background-color: #0056b3;
        }
        hr {
          margin: 20px 0;
          border: 0;
          border-top: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ShopIT Password Recovery</h1>
        </div>
        <div class="content">
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your password. Click the link below to set a new password:</p>
          <a href="${resetUrl}" class="btn">Reset Password</a>
          <hr>
          <p>If the button above does not work, you can copy and paste the following URL into your browser:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>If you did not request this password reset, please ignore this email.</p>
          <p>Thank you,<br>The ShopIT Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ShopIT. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "ShopIT Password Recovery",
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
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
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
  const user = await User.findById(req.user.id).select("+password");

  const isMatch = await user.comparePassword(req.body.currentPassword);
  if (!isMatch) {
    return next(new ErrorHandler("Password is incorrect", 401));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 401));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

const deleteOldAvatar = async (public_id) => {
  if (public_id && public_id !== "default_avatar") {
    await cloudinary.v2.uploader.destroy(public_id);
  }
};

export const updateProfile = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;

  const newUserData = {
    name,
    email,
  };

  if (req.file) {
    const newAvatar = {
      public_id: req.file.filename,
      url: req.file.path,
    };

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.avatar && user.avatar.public_id !== "default_avatar") {
      await deleteOldAvatar(user.avatar.public_id);
    }

    newUserData.avatar = newAvatar;
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user,
  });
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
    message: "User updated successfully",
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
        "User and all associated orders and cart items deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
