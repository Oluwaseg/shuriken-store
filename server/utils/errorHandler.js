// utils/errorHandler.js
export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
