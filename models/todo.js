const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A TODO must have a title"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // status of todo
    status: {
      type: String,
      enum: ["NOT_DONE", "IN_PROGRESS", "DONE"],
      default: "NOT_DONE",
      required: [true, "Please provide status of TODO"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    // Parent referencing the todo with the user
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A user must be associated with a todo"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// middlewares
todoSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "email _id",
  });
  next();
});

module.exports = Todo = mongoose.model("Todo", todoSchema);
