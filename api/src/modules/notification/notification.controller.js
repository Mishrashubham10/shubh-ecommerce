import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import Notification from './notification.model.js';

/**
 * GET USER NOTIFICATIONS
 */
export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification({
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    notifications,
  });

  sendSuccess(res, {
    success: true,
    message: 'Notifications fetched successfully',
    notifications,
  });
});

/**
 * MARK AS READ
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  await Notification.findOneAndUpdate(
    { _id: notificationId, userId: req.user._id },
    { isRead: true },
  );

  sendSuccess(res, {
    success: true,
    message: 'Notifications marked as read successfully',
  });
});