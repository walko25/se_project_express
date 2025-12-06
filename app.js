const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");
const { login, createUser } = require("./controllers/users");
const { getItems } = require("./controllers/clothingItems");
const userRoutes = require("./routes/users");
const itemRoutes = require("./routes/clothingItems");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(express.json());
app.use(cors());

app.post("/signin", login);
app.post("/signup", createUser);
app.get("/items", getItems);

app.use(auth);

app.use("/users", userRoutes);
app.use("/items", itemRoutes);

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
