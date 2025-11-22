const router = require("express").Router();
const { getItems } = require("../controllers/clothingItems");
const { updateItem } = require("../controllers/clothingItems");
const { createItem } = require("../controllers/clothingItems");
const { deleteItem } = require("../controllers/clothingItems");

// CRUD

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Update
router.put("/:itemId", updateItem);

// Delete
router.delete("/:itemId", deleteItem);

module.exports = router;
