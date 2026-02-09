import Notification from './notification.model.js';

/**
 * CREATE NOTIFICATION
 */
export const createNotificationService = async ({
  userId,
  title,
  message,
  type,
  metadata = {},
}) => {
  return await Notification.create({
    userId,
    title,
    message,
    type,
    metadata,
  });
};