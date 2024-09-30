const express = require("express");
const app = express();

// Import routers
const userRouter = require("./routes/users");
const bookRouter = require("./routes/book");

// Middleware
app.use(express.json());

// Use routers
app.use("/user", userRouter);
app.use("/book", bookRouter);

module.exports = app;
