const express = require("express");

const { createTodo, getAllTodos } = require("../controllers/todos_controller");
const authenticateMiddleware = require("../middlewares/authenticate_user_middleware");
const validateSchemaMiddleware = require("../middlewares/validate_user_input_middleware");

const router = express.Router();

router
  .route("/")
  .post(
    authenticateMiddleware.authenticateUser,
    validateSchemaMiddleware.validateCreateTodoSchema,
    createTodo
  )
  .get(authenticateMiddleware.authenticateUser, getAllTodos);

module.exports = router;
