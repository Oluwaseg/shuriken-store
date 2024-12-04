export const errorMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  const errorResponse = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.error = {
      stack: error.stack,
    };
  }

  res.status(statusCode).json(errorResponse);
};
