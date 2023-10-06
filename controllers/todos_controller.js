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

    // querying
    let queryObject = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    if (queryObject) {
      excludedFields.forEach((element) => delete queryObject[element]);
    }
    let queryString = JSON.stringify(queryObject);
    if (queryString) {
      queryString = queryString.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
    }
    let queryJSON;
    if (queryString) {
      queryJSON = JSON.parse(queryString);
    }
    let todosQuery = queryJSON
      ? Todo.find({ ...queryJSON, user })
      : Todo.find({ user });

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      todosQuery = todosQuery.sort(sortBy);
    } else {
      // sorting in descending order by createdAt
      todosQuery = todosQuery.sort("-createdAt");
    }

    // Field Limiting or projecting
    if (req.query.fields) {
      const selectedFields = req.query.split(",").join(" ");
      todosQuery = todosQuery.select(selectedFields);
    } else {
      // by default getting the data without __v field
      todosQuery = todosQuery.select("-__v");
    }

    // Pagination
    const page = req.query.page * 1 || 1; // converting the string to number
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    if (req.query.page) {
      // getting the number of documents from the database
      const numberOfTours = await Todo.countDocuments();
      if (skip >= numberOfTours) throw new Error("This page does not exists");
    }
    todosQuery = todosQuery.skip(skip).limit(limit);

    const todos = await todosQuery;
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
