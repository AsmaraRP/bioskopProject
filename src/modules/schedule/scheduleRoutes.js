const express = require("express");

const Router = express.Router();
const middlewareAuth = require("../../middleware/auth");
const scheduleController = require("./scheduleController");
const middlewareRedis = require("../../middleware/redis");

Router.get(
  "/",
  middlewareRedis.getScheduleRedis,
  scheduleController.getAllSchedule
);
Router.get(
  "/:id",
  middlewareRedis.getScheduleByIdRedis,
  scheduleController.getScheduleById
);
Router.post("/", middlewareAuth.isAdmin, middlewareRedis.clearSchceduleRedis, scheduleController.createSchedule);
Router.patch("/:id", middlewareAuth.isAdmin, middlewareRedis.clearSchceduleRedis, scheduleController.updateSchedule);
Router.delete(
  "/:id",
  middlewareAuth.isAdmin,
  middlewareRedis.clearSchceduleRedis,
  scheduleController.deleteSchedule
);

module.exports = Router;
