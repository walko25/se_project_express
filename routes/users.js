//
// IMPORTS
//
const express = require("express");
const { getCurrentUser, updateProfile } = require("../controllers/users");

const router = express.Router();

//
// ROUTES
//
router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
