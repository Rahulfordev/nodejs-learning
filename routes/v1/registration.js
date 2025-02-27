const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const UserModel = require("../../models/userModel");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");

// User Registration Route
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Create user in database
      const newUser = await UserModel.createUser({
        name,
        email,
        password,
        verificationToken,
      });

      // Send verification email
      const verificationLink = `${process.env.BASE_URL}/api/v1/auth/verify-email?token=${verificationToken}`;

      try {
        await sendEmail({
          from: `"Your App" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Verify Your Email",
          html: `
            <p>Hello ${name},</p>
            <p>Thank you for registering. Please verify your email by clicking the link below:</p>
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
              Verify Email
            </a>
            <p>If you didn’t create an account, you can ignore this email.</p>
          `,
        });
      } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        // Don't fail registration if email sending fails
      }

      res.status(201).json({
        message:
          "User registered successfully. A verification email has been sent.",
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
