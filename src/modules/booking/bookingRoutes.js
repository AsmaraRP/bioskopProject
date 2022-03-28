const express = require("express");

const Router = express.Router();
const bookingController = require("./bookingController");

Router.post("/", bookingController.createBooking);
Router.get("/id/:id", bookingController.getBookingById);
Router.get("/seat", bookingController.getSeatBooking);
Router.patch("/ticket/:id", bookingController.updateStatusBooking);
Router.get("/dashboard", bookingController.getDashboardBooking);
module.exports = Router;
