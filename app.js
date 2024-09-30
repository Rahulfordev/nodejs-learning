const express = require("express");
const app = express();

// Import routers
const userV1Router = require("./routes/v1/users");
const bookV1Router = require("./routes/v1/book");

// Middleware
app.use(express.json());

// Use routers
app.use("/api/v1/user", userV1Router);
app.use("/api/v1/book", bookV1Router);

module.exports = app;
