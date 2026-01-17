const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const auth = require("../middlewares/auth");
const {
  validateUserBody,
  validateAuthentication,
} = require("../middlewares/validation");

// Public auth routes
const { login, createUser } = require("../controllers/users");

// Protected routers (require authentication)
router.use("/users", auth, userRouter);
router.use("/items", clothingItem);

// Public endpoints for signing in / signing up
router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserBody, createUser);

const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");

router.use((req, res) => {
  res
    .status(NOT_FOUND_ERROR_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
