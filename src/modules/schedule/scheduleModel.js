const connection = require("../../config/mysql");

module.exports = {
  getTotalSchedule: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS total FROM schedule",
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMassage));
          }
        }
      );
    }),
  getAllSchedule: (limit, offset, searchLocation, sort) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM schedule JOIN movie ON schedule.movieId = movie.id WHERE location LIKE '%${searchLocation}%' ORDER BY ${sort} LIMIT ${limit} OFFSET ${offset}`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMassage));
          }
        }
      );
    }),
  getScheduleById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM schedule WHERE id= ?",
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
  createSchedule: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO schedule SET ?", data, (error, result) => {
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
  updateSchedule: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE schedule SET ? WHERE id = ?",
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
  deleteSchedule: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM schedule WHERE id= ?",
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
};
