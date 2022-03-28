const mysql = require("mysql2");

const dotenv = require("dotenv");

dotenv.config();
const connection = mysql.createConnection({
  port: process.env.PORT,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});
connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("You are now connected db mysql ...");
});
module.exports = connection;
