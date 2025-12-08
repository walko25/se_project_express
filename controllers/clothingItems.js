//
// IMPORTS
//
const clothingItem = require("../models/clothingItem");
const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
  BAD_REQUEST_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");

//
// CREATE ITEM
//
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user && req.user._id;

  if (!owner) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Owner id is required" });
  }

  return clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(CREATED_STATUS_CODE).send({ data: item }))
    .catch((err) => {
      console.error("createItem error:", err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }
      if (err.code === 11000) {
        return res
          .status(CONFLICT_ERROR_CODE)
          .send({ message: "Duplicate item" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

//
// GET ALL ITEMS
//
const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(OK_STATUS_CODE).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

//
// DELETE ITEM
//
const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const item = await clothingItem.findById(itemId).orFail();

    if (item.owner.toString() !== req.user._id.toString()) {
      return res
        .status(FORBIDDEN_ERROR_CODE)
        .send({ message: "Access denied" });
    }

    await clothingItem.findByIdAndDelete(itemId);
    return res.status(OK_STATUS_CODE).send({ data: item });
  } catch (err) {
    console.error("deleteItem error:", err);

    if (err.name === "DocumentNotFoundError") {
      return res
        .status(NOT_FOUND_ERROR_CODE)
        .send({ message: "Item not found" });
    }

    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST_ERROR_CODE)
        .send({ message: "Invalid item id" });
    }

    return res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .send({ message: "An error has occurred on the server" });
  }
};

//
// LIKE ITEM
//
const likedItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(OK_STATUS_CODE).send(item))
    .catch((err) => {
      console.error("likedItem error:", err);

      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      }

      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid item id" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

//
// DISLIKE ITEM
//
const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(OK_STATUS_CODE).send(item))
    .catch((err) => {
      console.error("dislikeItem error:", err);

      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      }

      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid item id" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

//
// EXPORT CONTROLLERS
//
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likedItem,
  dislikeItem,
};
