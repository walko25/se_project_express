const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
  BAD_REQUEST_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK_STATUS_CODE).send(users))
    .catch((err) => {
      console.error("getUsers error:", err);
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    const { password: _, ...userResponse } = savedUser.toObject();
    return res.status(CREATED_STATUS_CODE).send(userResponse);
  } catch (err) {
    console.error("createUser error:", err);
    if (err.code === 11000) {
      return res.status(CONFLICT_ERROR_CODE).send({ message: "Email already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    }
    return res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .send({ message: "An error has occurred on the server" });
  }
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: "User not found" });
      }
      res.status(OK_STATUS_CODE).send(user);
    })
    .catch((err) => {
      console.error("getCurrentUser error:", err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "User not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(OK_STATUS_CODE).send({ token });
  } catch (err) {
    res.status(UNAUTHORIZED_ERROR_CODE).send({ message: "Incorrect email or password" });
  }
};

const updateProfile = (req, res) => {
  const userId = req.user._id;

  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: "User not found" });
      }
      res.status(OK_STATUS_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Validation error", details: err.message });
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: "An error occurred on the server" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  updateProfile,
};
