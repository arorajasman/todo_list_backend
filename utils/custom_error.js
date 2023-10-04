module.exports = class CustomError extends Error {
  constructor(message, statusCode, type) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
    this.statusCode = statusCode;
    this.type = type;
  }
};
