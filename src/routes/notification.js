const express = require("express");
const notificationController = require("../controllers/notificationController");
const authVerify = require("../middlewares/authVerify");
const notificationRoute = express.Router();

notificationRoute.use(authVerify);

notificationRoute
  .route("/")
  .post(notificationController.createNotification)
  .get(notificationController.getNotifications);

module.exports = notificationRoute;
