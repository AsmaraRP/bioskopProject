const express = require("express");
const middlewareAuth = require("../../middleware/auth");

const Router = express.Router();
const userController = require("./userController");
const middlewareUploadProfile = require("../../middleware/uploadProfile");

Router.get("/:id", userController.getUserByUserId);
Router.patch(
  "/profile/:id",
  middlewareAuth.authentication,
  userController.updateProfile
);
Router.patch(
  "/image/:id",
  middlewareAuth.authentication,
  middlewareUploadProfile,
  userController.updateImage
);
Router.patch(
  "/password/:id",
  middlewareAuth.authentication,
  userController.updatePassword
);

module.exports = Router;
