const express = require("express");
const paymentController = require("../controllers/paymentController");
const authVerify = require("../middlewares/authVerify");
const paymentRoute = express.Router();

paymentRoute.post("/razorpay-callback", paymentController.razorpayCallback);
paymentRoute.get("/success", paymentController.successPayment);
paymentRoute.get("/failure", paymentController.failurePayment);

paymentRoute.use(authVerify);

paymentRoute.post("/make-payment", paymentController.makePayment);

paymentRoute.get("/list", paymentController.getAllPayment);

module.exports = paymentRoute;
