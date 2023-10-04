const express = require("express");

const {
  registerUser,
  loginUser,
  refreshToken,
} = require("../controllers/auth_controller");
const validateSchemaMiddleware = require("../middlewares/validate_user_input_middleware");

const router = express.Router();

router.post(
  "/register",
  validateSchemaMiddleware.validateRegisterUserInput,
  registerUser
);
router.post(
  "/login",
  validateSchemaMiddleware.validateLoginUserInput,
  loginUser
);
router.post(
  "/refresh-token",
  validateSchemaMiddleware.validateRefreshTokenSchema,
  refreshToken
);

module.exports = router;
