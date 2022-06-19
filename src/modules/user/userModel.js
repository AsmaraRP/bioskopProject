const connection = require("../../config/mysql");

module.exports = {
  getUserByUserId: (id) =>
    new Promise((resolve, reject) => {
      connection.query("SELECT firstName,lastName,image,noTelp,email,role FROM `user` WHERE id=?", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error.sqlMassage));
        }
      });
    }),
  updateProfile: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query("UPDATE user SET ? WHERE id = ?", [data, id], (error) => {
        if (!error) {
          const newResult = {
            id,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMassage));
        }
      });
    }),
};
