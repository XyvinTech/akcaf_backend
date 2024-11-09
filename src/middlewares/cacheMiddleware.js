const redisClient = require("../helpers/redisClient");

const cacheMiddleware = (keyPrefix) => async (req, res, next) => {
  try {
    const cacheKey = `${keyPrefix}_${
      req.params.id || req.query.pageNo || "default"
    }`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`);
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log(`Cache miss for ${cacheKey}`);
    res.sendResponse = res.json; // Save the original response method
    res.json = async (data) => {
      await redisClient.set(cacheKey, JSON.stringify(data), { EX: 3600 }); // Cache for 1 hour
      res.sendResponse(data);
    };

    next();
  } catch (err) {
    console.error("Redis caching error:", err);
    next();
  }
};

module.exports = cacheMiddleware;
