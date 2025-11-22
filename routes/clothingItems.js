const router = require("express").Router();
const { getItems } = require("../controllers/clothingItems");
// const { updateItem } = require("../controllers/clothingItems");
const { createItem } = require("../controllers/clothingItems");
const { deleteItem } = require("../controllers/clothingItems");
const { likedItem } = require("../controllers/clothingItems");
const { dislikeItem } = require("../controllers/clothingItems");

// CRUD

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Update
// router.put("/:itemId", updateItem);

// Delete
router.delete("/:itemId", deleteItem);

// Like/Dislike
router.put("/:itemId/likes", likedItem);
router.delete("/:id/likes", dislikeItem);

module.exports = router;
