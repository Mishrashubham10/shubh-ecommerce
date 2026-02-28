export const sendSuccess = (
  res,
  options = {}, // 👈 default empty object
) => {
  const {
    statusCode = 200,
    message = 'Success',
    data = null,
    meta = null,
  } = options;

  return res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
    ...(meta && { meta }),
  });
};