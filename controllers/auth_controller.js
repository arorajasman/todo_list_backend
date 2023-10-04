const jwt = require("jsonwebtoken");

const User = require("../models/user");
const CustomError = require("../utils/custom_error");

/** @type {import("express").RequestHandler} */
const registerUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    if (!user) {
      const err = new CustomError(
        "Unable to register the user",
        400,
        "BAD REQUEST"
      );
      return next(err);
    }
    res.status(201).json({ data: user });
  } catch (error) {
    if (error.code && error.code === 11000) {
      const err = new CustomError(
        "User with email already exists",
        400,
        "BAD REQUEST"
      );
      return next(err);
    }
    const err = new CustomError(error.toString(), 500, "INTERNAL SERVER ERROR");
    next(err);
  }
};

/** @type {import("express").RequestHandler} */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const err = new CustomError(
        "Unable to authorize the user",
        404,
        "NOT FOUND"
      );
      return next(err);
    }
    const isPasswordMatch = await user.comparePasswords(
      password,
      user.password
    );
    if (!isPasswordMatch) {
      const err = new CustomError(
        "Unable to authorize the user",
        400,
        "BAD REQUEST"
      );
      return next(err);
    }
    const payload = {
      id: user._id,
      email: user.email,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
    if (!accessToken) {
      const err = new CustomError(
        "Unable to authorize the user",
        400,
        "BAD REQUEST"
      );
      return next(err);
    }
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
    });
    if (!refreshToken) {
      const err = new CustomError(
        "Unable to authorize the user",
        400,
        "BAD REQUEST"
      );
      return next(err);
    }
    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    const err = new CustomError(
      "Unable to authorize the user",
      500,
      "INTERNAL SERVER ERROR"
    );
    next(err);
  }
};

/** @type {import("express").RequestHandler} */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const decodedData = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!decodedData) {
      const err = new CustomError("Invalid token", 401, "UNAUTHORIZED");
      return next(err);
    }
    const payload = {
      id: decodedData.id,
      email: decodedData.email,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
    if (!accessToken) {
      const err = new CustomError(
        "Unable to authorize the user",
        400,
        "BAD REQUEST"
      );
      return next(err);
    }
    res.status(200).json({ accessToken });
  } catch (error) {
    const err = new CustomError(error.toString(), 500, "INTERNAL SERVER ERROR");
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
};
