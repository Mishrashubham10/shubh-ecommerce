export const globalErrorHandler = (err, res, req, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};