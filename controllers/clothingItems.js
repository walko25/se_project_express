//
// IMPORTS
//
const clothingItem = require("../models/clothingItem");
const { OK_STATUS_CODE, CREATED_STATUS_CODE } = require("../utils/errors");
const ConflictError = require("../errors/ConflictError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

//
// CREATE ITEM
//
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user && req.user._id;

  if (!owner) {
    return next(new BadRequestError("Owner id is required"));
  }

  return clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(CREATED_STATUS_CODE).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        return next(new ConflictError("Duplicate item"));
      } else {
        return next(err);
      }
    });
};

//
// GET ALL ITEMS
//
const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.status(OK_STATUS_CODE).send(items))
    .catch(next);
};

//
// DELETE ITEM
//
const deleteItem = async (req, res, next) => {
  const { id } = req.params;

  try {
    const item = await clothingItem.findById(itemId).orFail();

    if (item.owner.toString() !== req.user._id.toString()) {
      return next(new ForbiddenError("Access denied"));
    }

    await clothingItem.findByIdAndDelete(itemId);
    return res.status(OK_STATUS_CODE).send({ data: item });
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Item not found"));
    } else if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item id"));
    } else {
      return next(err);
    }
  }
};

//
// LIKE ITEM
//
const likedItem = (req, res, next) => {
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
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      } else if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      } else {
        return next(err);
      }
    });
};

//
// DISLIKE ITEM
//
const dislikeItem = (req, res, next) => {
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
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      } else if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      } else {
        return next(err);
      }
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
