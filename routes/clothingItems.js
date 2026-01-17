const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getItems,
  createItem,
  deleteItem,
  likedItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const {
  validateId,
  validateClothingItem,
} = require("../middlewares/validation");

// CRUD

// Create
router.post("/", auth, validateClothingItem, createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:id", auth, validateId, deleteItem);

// Like/Dislike
router.put("/:id/likes", auth, validateId, likedItem);
router.delete("/:id/likes", auth, validateId, dislikeItem);

module.exports = router;
