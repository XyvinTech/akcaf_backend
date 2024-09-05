const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/paymentModel");
const responseHandler = require("../helpers/responseHandler");
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

exports.makePayment = async (req, res) => {
  try {
    const { userId } = req;
    const dateRandom = new Date().getTime();
    const options = {
      amount: 10 * 100,
      currency: "AED",
      receipt: `order_id${dateRandom}`,
    };
    instance.orders.create(options, async function (err, order) {
      if (order) {
        const paymentData = {
          userId,
          razorpayId: order.id,
          entity: order.entity,
          amount: order.amount / 100,
          amountDue: order.amount_due / 100,
          amountPaid: order.amount_paid,
          currency: order.currency,
          status: order.status,
          receipt: order.receipt,
          attempts: order.attempts,
        };
        const newPayment = await Payment.create(paymentData);
        return responseHandler(
          res,
          200,
          "Payment created successfully",
          newPayment
        );
      } else if (err) {
        return responseHandler(
          res,
          500,
          `Payment creation failed: ${err.message}`
        );
      }
    });
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.razorpayCallback = async (req, res) => {
  try {
    const { paymentId } = req.query;
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    const getDoc = await Payment.findOne({
      razorpayId: razorpayOrderId,
    });

    if (getDoc) {
      const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY);
      const data = hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const generatedSignature = data.digest("hex");
      if (generatedSignature === razorpaySignature) {
        const fetchOrderData = await instance.orders.fetch(razorpayOrderId);
        if (fetchOrderData.status) {
          delete fetchOrderData.id;
          const updatePayment = await Payment.findOneAndUpdate(
            { _id: paymentId },
            {
              amount: fetchOrderData.amount / 100,
              amountPaid: fetchOrderData.amount_paid / 100,
              amountDue: fetchOrderData.amount_due,
              status: fetchOrderData.status,
              attempts: fetchOrderData.attempts,
            },
            { new: true }
          );
          return responseHandler(
            res,
            200,
            "Payment updated successfully",
            updatePayment
          );
        } else {
          return responseHandler(
            res,
            500,
            `Payment failed: ${fetchOrderData.message}`
          );
        }
      } else {
        return responseHandler(
          res,
          400,
          "Unable to verify the signature ! Contact Team now"
        );
      }
    } else {
      return responseHandler(res, 500, "Payment not found");
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};
