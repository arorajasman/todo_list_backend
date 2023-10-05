const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");

const authRoutes = require("./routes/auth_routes");
const todoRoutes = require("./routes/todo_routes");
const error = require("./middlewares/error_middleware");

dotenv.config({ path: __dirname + "/.env" });

const app = express();

// middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// connecting to database
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to database successfully"))
  .catch((error) =>
    console.log(`Error while connecting to database:\n ${error}`)
  );

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/todos", todoRoutes);

// register route not found middleware
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `route ${req.url} not found`,
  });
});

// register error middleware
app.use(error.errorMiddlware);

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is up and running at port ${process.env.PORT}`);
});
