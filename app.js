//
// IMPORTS
//
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
require("dotenv").config();

const app = express();
const { PORT = 3001 } = process.env;

//
// DATABASE CONNECTION
//
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

//
// CRASH TEST ROUTE
//
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

//
// MIDDLEWARE & ROUTES
//
app.use(express.json());
const allowedOrigins = [
  "https://wtwr.2526.jumpingcrab.com",
  "https://www.wtwr.2526.jumpingcrab.com",
  "https://api.wtwr.2526.jumpingcrab.com",
  "http://wtwr.2526.jumpingcrab.com",
  "http://www.wtwr.2526.jumpingcrab.com",
  "http://api.wtwr.2526.jumpingcrab.com",
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(requestLogger);
app.use("/", mainRouter);

// app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

//
// SERVER STARTUP
//
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
