//
// IMPORTS
//
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

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
// MIDDLEWARE & ROUTES
//
app.use(express.json());
app.use(cors());
app.use("/", mainRouter);

//
// SERVER STARTUP
//
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
