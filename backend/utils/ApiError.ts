class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors?: unknown;

  constructor(statusCode: number, message: string, errors?: unknown, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
