const Razorpay = require("razorpay");
const path = require("path");
const crypto = require("crypto");
const Payment = require("../models/paymentModel");
const responseHandler = require("../helpers/responseHandler");
const User = require("../models/userModel");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET);
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const gateway = "stripe";

exports.makePayment = async (req, res) => {
  try {
    const { userId } = req;
    const dateRandom = new Date().getTime();

    if (gateway === "stripe") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "aed",
              product_data: {
                name: "AKCAF Membership",
              },
              unit_amount: 1000,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `https://akcafconnect.com/api/v1/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://akcafconnect.com/api/v1/payment/failure?session_id={CHECKOUT_SESSION_ID}`,
      });
      const successUrl = `https://akcafconnect.com/api/v1/payment/success?session_id=${session.id}`;
      const cancelUrl = `https://akcafconnect.com/api/v1/payment/failure?session_id=${session.id}`;
      session.success_url = successUrl;
      session.cancel_url = cancelUrl;
      const paymentData = {
        user: userId,
        gatewayId: session.id,
        entity: "order",
        amount: 10,
        amountDue: 10,
        amountPaid: 0,
        currency: "AED",
        status: "created",
        receipt: `order_id${dateRandom}`,
        attempts: 1,
      };
      await Payment.create(paymentData);
      return responseHandler(
        res,
        200,
        "Payment created successfullyy",
        session.url
      );
    }

    const options = {
      amount: 10 * 100,
      currency: "AED",
      receipt: `order_id${dateRandom}`,
    };
    instance.orders.create(options, async function (err, order) {
      if (order) {
        const paymentData = {
          user: userId,
          gatewayId: order.id,
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
          "Payment created successfullyy",
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

exports.successPayment = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    const updatePayment = await Payment.findOneAndUpdate(
      { gatewayId: sessionId },
      {
        amountDue: 0,
        status: "completed",
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      updatePayment.user,
      { status: "active" },
      { new: true }
    );
    res.sendFile(path.join(__dirname, "../../views/success.html"));
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.failurePayment = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    const updatePayment = await Payment.findOneAndUpdate(
      { gatewayId: sessionId },
      {
        status: "failed",
      },
      { new: true }
    );
    res.sendFile(path.join(__dirname, "../../views/cancel.html"));
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.razorpayCallback = async (req, res) => {
  try {
    const { paymentId } = req.query;
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    const getDoc = await Payment.findOne({
      gatewayId: razorpayOrderId,
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
          await User.findByIdAndUpdate(
            updatePayment.userId,
            { status: "active" },
            { new: true }
          );
          return responseHandler(
            res,
            200,
            "Payment updated successfullyy",
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

exports.getAllPayment = async (req, res) => {
  try {
    const { pageNo = 1, status, limit = 10 } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const filter = {};
    if (status) {
      filter.status = status;
    }
    const payment = await Payment.find(filter)
      .populate("user", "name")
      .skip(skipCount)
      .limit(limit)
      .sort({ createdAt: -1, _id: 1 })
      .lean();
    const totalCount = await Payment.countDocuments(filter);

    const mappedData = payment.map((item) => {
      let fullName = item.name.first;
      if (item.name.middle) {
        fullName += ` ${item.name.middle}`;
      }
      if (item.name.last) {
        fullName += ` ${item.name.last}`;
      }
      return {
        ...item,
        fullName,
      };
    });

    return responseHandler(
      res,
      200,
      `Payment found successfully..!`,
      mappedData,
      totalCount
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};
