const express = require("express");
const router = express.Router();
const UserModel = require("../../models/userModel");

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Invalid or missing token" });
  }

  try {
    const user = await UserModel.verifyUser(token);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    res.json({
      message: "Email verified successfully. You can now log in.",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
