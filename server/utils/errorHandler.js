export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    if (process.env.NODE_ENV !== 'production') {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
