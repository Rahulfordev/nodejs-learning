const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const UserModel = require("../../models/userModel");
const sendEmail = require("../../utils/sendEmail"); // Function to send emails

// Resend verification email
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  try {
    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already verified
    if (user.is_verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Generate new verification token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = bcrypt.hashSync(token, 10);

    // Save token in the database
    await UserModel.saveVerificationToken(email, tokenHash);

    // Send verification email
    const verificationLink = `http://localhost:5000/api/v1/auth/verify-email?token=${token}`;
    await sendEmail(
      user.email,
      "Verify Your Email",
      `Click this link to verify: ${verificationLink}`
    );
    res.json({ message: "Verification email sent. Please check your inbox." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
