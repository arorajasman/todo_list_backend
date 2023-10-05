const joi = require("joi");

module.exports = {
  registerUserSchema: joi.object().keys({
    email: joi.string().email().label("email").required(),
    password: joi.string().min(5).max(10).label("password").required(),
    firstName: joi.string().label("firstName").optional(),
    lastName: joi.string().label("lastName").optional(),
  }),
  loginUserSchema: joi.object().keys({
    email: joi.string().email().label("email").required(),
    password: joi.string().min(5).max(10).label("password").required(),
  }),
  refreshTokenSchema: joi.object().keys({
    refreshToken: joi.string().label("refreshToken").required(),
  }),
  createTodoSchema: joi.object().keys({
    title: joi.string().label("title").required(),
    description: joi.string().label("description").optional(),
  }),
};
