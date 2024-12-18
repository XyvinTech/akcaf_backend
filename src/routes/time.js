const express = require("express");
const timeController = require("../controllers/timeController");
const authVerify = require("../middlewares/authVerify");
const timeRoute = express.Router();

timeRoute.use(authVerify);

timeRoute
  .route("/")
  .post(timeController.createTime)
  .get(timeController.getTimes);

timeRoute.get("/bookings", timeController.getBookingByDate);

module.exports = timeRoute;
