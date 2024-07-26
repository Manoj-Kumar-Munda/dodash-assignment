class ApiError extends Error {
  constructor(
    statusCode,
    message = "Internal server error",
    errors = [],
    stack = ""
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constuctor);
    }
  }
}

export { ApiError };
