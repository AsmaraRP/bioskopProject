const express = require("express");

const Router = express.Router();
const authController = require("./authController");

Router.post("/register", authController.register);
Router.post("/login", authController.login);
Router.get("/activation/:id", authController.activation);

module.exports = Router;
