const express = require("express");
const paymentController = require("../controllers/paymentController");
const authVerify = require("../middlewares/authVerify");
const paymentRoute = express.Router();

paymentRoute.post("/razorpay-callback", paymentController.razorpayCallback);

paymentRoute.use(authVerify);

paymentRoute.post("/make-payment", paymentController.makePayment);

paymentRoute.put("/verify", paymentController.verifyPayment);

paymentRoute.get("/list", paymentController.getAllPayment);

module.exports = paymentRoute;
