const { createClient } = require("redis");
const dotenv = require("dotenv");

dotenv.config();
const client = createClient({
  // host: ,
  // port: ,
  // password: ,
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

(async () => {
  client.connect();
  client.on("connect", () => {
    console.log("You're now connected db redis ...");
  });
})();

module.exports = client;
