const { createClient } = require("redis");

const client = createClient({
  host: "127.0.0.1",
  port: 6379,
  password: "",
  // url: `redis://${redishosh}:${redisport}`
});

(async () => {
  client.connect();
  client.on("connect", () => {
    console.log("You're now connected db redis ...");
  });
})();

module.exports = client;
