const express = require("express");
const middlewareAuth = require("../../middleware/auth");

const Router = express.Router();
const bookingController = require("./bookingController");

Router.post(
  "/",
  middlewareAuth.authentication,
  bookingController.createBooking
);
Router.get(
  "/id/:id",
  middlewareAuth.authentication,
  bookingController.getBookingById
);
Router.get(
  "/user/:id",
  middlewareAuth.authentication,
  bookingController.getBookingByUserId
);
Router.get("/seat", bookingController.getSeatBooking);
Router.patch(
  "/ticket/:id",
  middlewareAuth.authentication,
  bookingController.updateStatusBooking
);
Router.get(
  "/dashboard",
  middlewareAuth.isAdmin,
  bookingController.getDashboardBooking
);
module.exports = Router;
