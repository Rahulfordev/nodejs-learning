const express = require("express");
const router = express.Router();

// Import routes
const bookRoutes = require("./book");
const userRoutes = require("./user");

// Use routes
router.use("/book", bookRoutes);
router.use("/user", userRoutes);

module.exports = router;
