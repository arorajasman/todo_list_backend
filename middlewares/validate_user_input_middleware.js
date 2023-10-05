const joi = require("joi");

const CustomError = require("../utils/custom_error");
const schemas = require("../utils/schemas");

exports.validateRegisterUserInput = async (req, res, next) => {
  const data = schemas.registerUserSchema.validate(req.body);
  if (data.error) {
    const err = new CustomError(
      data.error.message.toString(),
      400,
      "BAD_REQUEST"
    );
    return next(err);
  }
  next();
};

exports.validateLoginUserInput = async (req, res, next) => {
  const data = schemas.loginUserSchema.validate(req.body);
  if (data.error) {
    const err = new CustomError(
      data.error.message.toString(),
      400,
      "BAD_REQUEST"
    );
    return next(err);
  }
  next();
};

exports.validateRefreshTokenSchema = async (req, res, next) => {
  const data = schemas.refreshTokenSchema.validate(req.body);
  if (data.error) {
    const err = new CustomError(
      data.error.message.toString(),
      400,
      "BAD_REQUEST"
    );
    return next(err);
  }
  next();
};

exports.validateCreateTodoSchema = async (req, res, next) => {
  const data = schemas.createTodoSchema.validate(req.body);
  if (data.error) {
    const err = new CustomError(
      data.error.message.toString(),
      400,
      "BAD_REQUEST"
    );
    return next(err);
  }
  next();
};
