const Todo = require("../models/todo");
const CustomError = require("../utils/custom_error");

/** @type {import("express").RequestHandler} */
const createTodo = async (req, res, next) => {
  try {
    // getting the id of the current logged in user
    const { id } = req.user;
    if (!id) {
      const err = new CustomError(
        "User not found to add the todo task",
        404,
        "NOT FOUND"
      );
      return next(err);
    }
    const todo = await Todo.create({ ...req.body, user: id });
    if (!todo) {
      const err = new CustomError(
        "Unable to create the todo",
        400,
        "BAD REQUEST"
      );
      return next(err);
    }
    res.status(201).json({ data: todo });
  } catch (error) {
    const err = new CustomError(error, 500, "INTERNAL SERVER ERROR");
    next(err);
  }
};

/** @type {import("express").RequestHandler} */
const getAllTodos = async (req, res, next) => {
  try {
    // get id of the current logged in user
    const user = req.user.id;
    const todos = await Todo.find({ user });
    if (!todos) {
      const err = new CustomError(
        `No Task found for the user`,
        404,
        "NOT FOUND"
      );
      return next(err);
    }
    res.status(200).json({ data: todos });
  } catch (error) {
    const err = new CustomError(error, 500, "INTERNAL SERVER ERROR");
    next(err);
  }
};

module.exports = {
  createTodo,
  getAllTodos,
};
