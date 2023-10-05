const jsonwebtoken = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../models/user");
const CustomError = require("../utils/custom_error");

/** @type {import("express").RequestHandler} */
exports.authenticateUser = async (req, res, next) => {
  try {
    let token = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      const err = new CustomError(
        "Unable to authorize the user",
        401,
        "UNAUTHORIZED"
      );
      return next(err);
    }
    const decodedData = await promisify(jsonwebtoken.verify)(
      token,
      process.env.JWT_SECRET
    );
    const user = await User.findById(decodedData.id);
    if (!user) {
      const err = new CustomError(
        "Unable to authorize the user",
        404,
        "NOT FOUND"
      );
      return next(err);
    }
    req.user = user;
    next();
  } catch (error) {
    const err = new CustomError(
      "Unable to authorize the user",
      500,
      "INTERNAL SERVER ERROR"
    );
    next(err);
  }
};
