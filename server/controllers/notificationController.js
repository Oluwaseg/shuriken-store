import Notification from '../models/Notification.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ErrorHandler } from '../utils/errorHandler.js';

export const getNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // Assuming user ID is in req.user (via authentication middleware)

  const notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 }) // Sort by latest first
    .populate('user', 'name email avatar'); // Optional: populate user info if needed

  res.status(200).json({
    success: true,
    count: notifications.length,
    notifications,
  });
});

// Mark notifications as read
export const markAsRead = catchAsync(async (req, res, next) => {
  const { notificationId } = req.params;

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return next(new ErrorHandler('Notification not found', 404));
  }

  if (notification.read) {
    return res.status(400).json({
      success: false,
      message: 'Notification already marked as read',
    });
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    notification,
  });
});

// Delete notification
export const deleteNotification = catchAsync(async (req, res, next) => {
  const { notificationId } = req.params;

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return next(new ErrorHandler('Notification not found', 404));
  }

  await notification.remove();

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully',
  });
});
