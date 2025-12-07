const express = require("express");
const { getCurrentUser, updateProfile } = require("../controllers/users");

const router = express.Router();

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
