const express = require("express");
const notificationController = require("../controllers/notificationController");
const authVerify = require("../middlewares/authVerify");
const notificationRoute = express.Router();

notificationRoute.use(authVerify);

notificationRoute.post("/", notificationController.createNotification);

module.exports = notificationRoute;
