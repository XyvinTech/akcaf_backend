const redis = require("redis");

//! Create a Redis client
const client = redis.createClient();

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

(async () => {
  await client.connect();
})();

module.exports = client;
