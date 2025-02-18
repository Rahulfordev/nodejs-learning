const express = require("express");
const route = express.Router();

// Import routers
const v1Routes = require("./v1");

// Use routes
route.use("/v1", v1Routes);

module.exports = route;
