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
        expiryDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
      };
      await Payment.create(paymentData);
      return responseHandler(
        res,
        200,
        "Payment created successfully",
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

exports.getAllPayment = async (req, res) => {
  try {
    const { pageNo = 1, status, limit = 10 } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const filter = {};
    if (status) {
      filter.status = status;
    }
    const payment = await Payment.find(filter)
      .populate("user", "fullName")
      .skip(skipCount)
      .limit(limit)
      .sort({ createdAt: -1, _id: 1 })
      .lean();
    const mappedData = payment.map((item) => {
      return {
        ...item,
        fullName: item.user.fullName,
      };
    });
    const totalCount = await Payment.countDocuments(filter);

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

exports.createPayment = async (req, res) => {
  try {
    const { user, expiryDate, amount = 10 } = req.body;
    if (!user) {
      return responseHandler(res, 400, "User is required");
    }

    if (!expiryDate) {
      return responseHandler(res, 400, "Expiry Date is required");
    }

    const dateRandom = new Date().getTime();
    const paymentData = {
      user: user,
      gatewayId: "admin",
      entity: "order",
      amount: Number(amount),
      amountDue: Number(amount),
      amountPaid: 0,
      currency: "AED",
      status: "completed",
      receipt: `order_id${dateRandom}`,
      attempts: 1,
      expiryDate: expiryDate,
    };

    const payment = await Payment.create(paymentData);

    await User.findByIdAndUpdate(user, { status: "active" }, { new: true });

    return responseHandler(
      res,
      200,
      `Payment created successfully..!`,
      payment
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Payment ID is required");
    }
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      return responseHandler(res, 404, "Payment not found");
    }

    const payments = await Payment.find({
      user: payment.user,
    });

    if (payments.length === 0) {
      await User.findByIdAndUpdate(payment.user, {
        status: "awaiting_payment",
      });
    } else {
      payments.map(async (item) => {
        if (item.status === "completed") {
          await User.findByIdAndUpdate(payment.user, { status: "active" });
        } else {
          await User.findByIdAndUpdate(payment.user, {
            status: "awaiting_payment",
          });
        }
      });
    }

    return responseHandler(
      res,
      200,
      `Payment deleted successfully..!`,
      payment
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};
