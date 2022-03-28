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
        `SELECT * FROM schedule WHERE location LIKE '%${searchLocation}%' ORDER BY location ${sort} LIMIT ${limit} OFFSET ${offset}`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMassage));
          }
        }
      );
    }),
  getAllMovie: (limit, offset, searchName, sort) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM movie WHERE name LIKE '%${searchName}%' ORDER BY name ${sort} LIMIT ${limit} OFFSET ${offset}`,
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
};
