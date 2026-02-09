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

  res.json({ success: true });
});