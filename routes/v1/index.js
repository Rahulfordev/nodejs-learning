const express = require("express");
const router = express.Router();

// Import routes
const registerRoutes = require("./registration");
const loginRoutes = require("./login");
const passwordResetRoutes = require("./passwordReset");
const verifyEmailRoutes = require("./verifyEmail");

// Use routes under /auth
router.use("/auth", registerRoutes);
router.use("/auth", loginRoutes);
router.use("/auth", passwordResetRoutes);
router.use("/auth", verifyEmailRoutes);

module.exports = router;
