const express = require("express");
const app = express();

// Import routers
const routes = require("./routes");

// Middleware
app.use(express.json());

// Use routers
app.use("/api", routes);

module.exports = app;
