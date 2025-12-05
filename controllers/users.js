const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
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
      password: hashedPassword, // Save the hashed version, not the original
    });

    const savedUser = await user.save();
    return res.status(201).send(savedUser);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).send({ message: "Email already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    }
    return res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .send({ message: "An error has occurred on the server" });
  }
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
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

module.exports = {
  getUsers,
  createUser,
  getUser,
};
