const helperWrapper = require("../../helper/wrapper");
const bookingModel = require("./bookingModel");

module.exports = {
  createBooking: async (request, response) => {
    try {
      const {
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
        seat,
      } = request.body;
      const totalTicket = seat.length;
      const setData = {
        scheduleId,
        dateBooking,
        timeBooking,
        totalTicket,
        totalPayment,
        paymentMethod,
        statusPayment: "Active",
        createdAt: new Date(Date.now()),
      };
      const result = await bookingModel.createBooking(setData);
      const bookingId = result.id;
      const setDataSeat = seat.map((item) => [
        bookingId,
        item,
        new Date(Date.now()),
      ]);

      console.log(setDataSeat);
      await bookingModel.createBookingSeat(setDataSeat);

      // eslint-disable-next-line prettier/prettier
       return helperWrapper.response(response, 200, "Success create data Booking!", result);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  getBookingById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await bookingModel.getBookingById(id);
      if (result.length <= 0) {
        // eslint-disable-next-line prettier/prettier
    return helperWrapper.response(response, 404, "Data by Id is not found", null);
      }
      return helperWrapper.response(response, 200, "Success get data!", result);
    } catch (error) {
      //   console.log(error);
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  getSeatBooking: async (request, response) => {
    try {
      const { scheduleId, dateBooking, timeBooking } = request.query;
      const result = await bookingModel.getSeatBooking(
        scheduleId,
        dateBooking,
        timeBooking
      );

      return helperWrapper.response(response, 200, "Success get data!", result);
    } catch (error) {
      //   console.log(error);
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  updateStatusBooking: async (request, response) => {
    try {
      const { id } = request.params;
      const cekId = await bookingModel.getBookingById(id);
      if (cekId.length <= 0) {
        // eslint-disable-next-line prettier/prettier
    return helperWrapper.response(response, 404, "Ticket is not found", null);
      }
      const setData = { statusUsed: "used" };
      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }
      const result = await bookingModel.updateStatusBooking(id, setData);
      return helperWrapper.response(
        response,
        200,
        "Success Updating data!",
        result
      );
    } catch (error) {
      //   console.log(error);
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  getDashboardBooking: async (request, response) => {
    try {
      let { scheduleId, movieId, location } = request.query;
      scheduleId = scheduleId || 1;
      movieId = movieId || 1;
      location = location || "";

      const result = await bookingModel.getDashboardBooking(
        scheduleId,
        movieId,
        location
      );
      return helperWrapper.response(response, 200, "Success get data!", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!");
    }
  },
};
