const Redis = require("ioredis");

const redisClient = new Redis("redis://localhost:6379");
redisClient.on("connect", () => {
  console.log("redis connected");
});
module.exports = redisClient;
