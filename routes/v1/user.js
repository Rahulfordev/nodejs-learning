const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ name: "rahul", age: 20 });
});

router.post("/", (req, res) => {
  res.json({ name: "azam", age: 21 });
});

module.exports = router;
