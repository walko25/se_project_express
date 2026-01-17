//
// IMPORTS
//
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { OK_STATUS_CODE, CREATED_STATUS_CODE } = require("../utils/errors");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ForbiddenError = require("../errors/ForbiddenError");
const { JWT_SECRET } = require("../utils/config");

//
// CREATE USER (SIGN UP)
//
const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

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
      return next(new ConflictError("Email already exists"));
    }

    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    }

    return next(err);
  }
};

//
// GET CURRENT USER
//
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(OK_STATUS_CODE).send({ data: user }))
    .catch((err) => {
      console.error("getCurrentUser error:", err);

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }

      return next(err);
    });
};

//
// LOGIN USER
//
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(next);
};

//
// UPDATE PROFILE
//
const updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { $set: { name, avatar } },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error("updateProfile error:", err);

      if (err.name === "ValidationError") {
        return next(new BadRequestError("Validation error"));
      }

      return next(err);
    });
};

//
// EXPORT CONTROLLERS
//
module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateProfile,
};
