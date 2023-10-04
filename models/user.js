const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide your email"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      minlength: [6, "Password should be at least 6 characters"],
      select: false,
      required: [true, "A user must have a password"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// middlewares
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// instance methods
userSchema.methods.comparePasswords = async function (password, passwordHash) {
  return await bcrypt.compare(password, passwordHash);
};

module.exports = User = mongoose.model("User", userSchema);
