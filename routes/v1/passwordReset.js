const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const UserModel = require("../../models/userModel");

// Request Password Reset
router.post(
  "/reset-password-request",
  [body("email").isEmail().withMessage("Valid email is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      const user = await UserModel.findByEmail(email);

      if (!user) {
        return res
          .status(400)
          .json({ message: "User with this email does not exist" });
      }

      // Generate a reset token (expires in 1 hour)
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = await bcrypt.hash(resetToken, 10);
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour

      // Store token in DB using the model
      await UserModel.saveResetToken(email, hashedToken, expiresAt);

      res.status(200).json({
        message: "Password reset link generated",
        resetToken, // Normally, don't expose this in production
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Reset Password
router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Token is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, newPassword } = req.body;

    try {
      const user = await UserModel.findByResetToken(token);

      if (!user || new Date(user.reset_token_expires) < new Date()) {
        return res
          .status(400)
          .json({ message: "Invalid or expired reset token" });
      }

      // Update the password using the model
      await UserModel.updatePassword(user.id, newPassword);

      res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
