const helperWrapper = require("../../helper/wrapper");
const bookingModel = require("./bookingModel");
const helperMidtrans = require("../../helper/midtrans");
const { v4: uuidv4 } = require('uuid');

module.exports = {
  createBooking: async (request, response) => {
    try {
      const {
        userId,
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
        seat,
      } = request.body;
      const totalTicket = seat.length;
      const setData = {
        id : uuidv4(),
        userId,
        scheduleId,
        dateBooking,
        timeBooking,
        totalTicket,
        totalPayment,
        paymentMethod,
        statusPayment: "succsess",
        createdAt: new Date(Date.now()),
      };
      const result = await bookingModel.createBooking(setData);
      const bookingId = result.id;
      const setDataSeat = seat.map((item) => [
        bookingId,
        item,
        new Date(Date.now()),
      ]);
      await bookingModel.createBookingSeat(setDataSeat);
      const setDataMidtrans = {
        id: result.id,
        total: result.totalPayment,
      }
      const resultMidtrans = await helperMidtrans.post(setDataMidtrans);
      return helperWrapper.response(
        response,
        200,
        "Success create data Booking!",
        {result, redirectUrl: resultMidtrans.redirect_url}
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  getBookingById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await bookingModel.getBookingById(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          "Data by Id is not found",
          null
        );
      }
      return helperWrapper.response(response, 200, "Success get data!", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  getBookingByUserId: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await bookingModel.getBookingByUserId(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          "Data by Id is not found",
          null
        );
      }
      return helperWrapper.response(response, 200, "Success get data!", result);
    } catch (error) {
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
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  updateStatusBooking: async (request, response) => {
    try {
      const { id } = request.params;
      const cekId = await bookingModel.getBookingById(id);
      if (cekId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          "Ticket is not found",
          null
        );
      }
      const setData = { statusUsed: "used" };
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
      const profit = await bookingModel.getProfit();
      return helperWrapper.response(response, 200, "Success get data!", [
        result,
        profit,
      ]);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!");
    }
  },
  postMidtransNotification: async (request,response) =>{
    try{
      console.log(request.body);
      const result = await helperMidtrans.notif(request.body);
      const orderId = result.order_id;
      const transactionStatus = result.transaction_status;
      const fraudStatus = result.fraud_status;

      console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

        // Sample transactionStatus handling logic

      if (transactionStatus == 'capture'){
          // capture only applies to card transaction, which you need to check for the fraudStatus
          if (fraudStatus == 'challenge'){
              // TODO set transaction status on your databaase to 'challenge'
          } else if (fraudStatus == 'accept'){
              // TODO set transaction status on your databaase to 'success'
              const setData = {
                paymentMethod: result.payment_type,
                statusPayment: "SUCCESS"
              };
              console.log(`PAYMENT SUCCESS by id ${orderId} and ${JSON.stringify(setData)}`);
          }
      } else if (transactionStatus == 'settlement'){
          // TODO set transaction status on your databaase to 'success'
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "SUCCESS"
          };
          console.log(`PAYMENT SUCCESS by id ${orderId} and ${JSON.stringify(setData)}`);
      } else if (transactionStatus == 'deny'){
          // TODO you can ignore 'deny', because most of the time it allows payment retries
          // and later can become success
      } else if (transactionStatus == 'cancel' ||
        transactionStatus == 'expire'){
          // TODO set transaction status on your databaase to 'failure'
      } else if (transactionStatus == 'pending'){
          // TODO set transaction status on your databaase to 'pending' / waiting payment
      }
    } catch(error){
      return helperWrapper.response(response,400,"Bad Request!");
    }
  },
};
