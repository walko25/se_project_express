const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_ERROR_CODE } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    const error = new Error("Authorization required");
    error.statusCode = UNAUTHORIZED_ERROR_CODE;
    return next(error);
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    return next();
  } catch (err) {
    const error = new Error("Authorization required");
    error.statusCode = UNAUTHORIZED_ERROR_CODE;
    return next(error);
  }
};

module.exports = auth;
