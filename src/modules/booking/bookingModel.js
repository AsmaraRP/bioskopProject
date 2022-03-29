const connection = require("../../config/mysql");

module.exports = {
  createBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO booking SET ?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMassage));
        }
      });
    }),
  createBookingSeat: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO bookingseat (bookingId, seat, createdAt) VALUES ?",
        [data],
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            console.log(error);
            reject(new Error(error.sqlMassage));
          }
        }
      );
    }),
  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM booking JOIN bookingseat ON booking.id = bookingseat.bookingId WHERE bookingid= ?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMassage));
          }
        }
      );
    }),
  getSeatBooking: (scheduleId, dateBooking, timeBooking) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM booking JOIN bookingseat ON booking.id = bookingseat.bookingId WHERE scheduleId = ${scheduleId} && dateBooking LIKE '%${dateBooking}%' && timeBooking LIKE '%${timeBooking}%'`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMassage));
          }
        }
      );
    }),
  updateStatusBooking: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET ? WHERE id = ?",
        [data, id],
        (error) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMassage));
          }
        }
      );
    }),
  getDashboardBooking: (scheduleId, movieId, location) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM schedule JOIN movie ON schedule.movieId = movie.id JOIN booking ON schedule.id = booking.scheduleId JOIN bookingseat ON booking.id = bookingseat.bookingId WHERE scheduleId = ${scheduleId} && movieId = ${movieId} && location LIKE '%${location}%'`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMassage));
          }
        }
      );
    }),
  getProfit: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT DAY(createdAt) AS DAY, SUM(totalPayment) FROM booking GROUP BY DAY(createdAt)",
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMassage));
          }
        }
      );
    }),
};
