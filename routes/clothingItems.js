const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likedItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CRUD

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", deleteItem);

// Like/Dislike
router.put("/:itemId/likes", likedItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
