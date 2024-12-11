import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ErrorHandler } from '../utils/errorHandler.js';

export const isAuthenticated = catchAsync(async (req, res, next) => {
  let token = req.cookies.token || req.headers['authorization']?.split(' ')[1]; // Get token from cookie or header

  if (!token) {
    return next(new ErrorHandler('Login first to access this resource', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorHandler('User not found', 401));
    }

    next();
  } catch (err) {
    return next(new ErrorHandler('Invalid or expired token', 401));
  }
});

// GRANT ACCESS TO SPECIFIC ROUTES
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};
