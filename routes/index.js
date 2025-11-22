const router = require("express").Router();
const clothingItem = require("./clothingItems");

const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItem);

const { NOT_FOUND_ERROR_CODE } = require('../utils/errors');

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Full scope error' });
});

module.exports = router;
