const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getItems,
  createItem,
  deleteItem,
  likedItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CRUD

// Create
router.post("/", auth, createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", auth, deleteItem);

// Like/Dislike
router.put("/:itemId/likes", auth, likedItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
