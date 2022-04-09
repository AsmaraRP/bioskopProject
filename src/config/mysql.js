const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
const connection = mysql.createConnection({
  // port: process.env.MYSQL_PORT,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});
connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("You are now connected db mysql ...");
});
module.exports = connection;
