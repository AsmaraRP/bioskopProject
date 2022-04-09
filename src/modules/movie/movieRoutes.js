const express = require("express");

const Router = express.Router();
const movieController = require("./movieController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUploadMovie = require("../../middleware/uploadMovie");
const middlewareRedis = require("../../middleware/redis");

Router.get("/", middlewareRedis.getMovieRedis, movieController.getAllMovie);
Router.get(
  "/:id",
  middlewareRedis.getMovieByIdRedis,
  movieController.getMovieById
);
Router.post(
  "/",
  middlewareAuth.isAdmin,
  middlewareRedis.clearMovieRedis,
  middlewareUploadMovie,
  movieController.createMovie
);
Router.patch(
  "/:id",
  middlewareAuth.isAdmin,
  middlewareRedis.clearMovieRedis,
  middlewareUploadMovie,
  movieController.updateMovie
);
Router.delete("/:id", middlewareAuth.isAdmin,middlewareRedis.clearMovieRedis, movieController.deleteMovie);

module.exports = Router;
