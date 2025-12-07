const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const auth = require("../middlewares/auth");

// Public auth routes
const { login, createUser } = require("../controllers/users");

// Protected routers (require authentication)
router.use("/users", auth, userRouter);
router.use("/items", auth, clothingItem);

// Public endpoints for signing in / signing up
router.post("/signin", login);
router.post("/signup", createUser);

const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: "Full scope error" });
});

module.exports = router;
