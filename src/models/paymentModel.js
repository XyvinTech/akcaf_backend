const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    razorpayId: { type: String },
    entity: { type: String },
    amount: { type: Number },
    amountPaid: { type: Number },
    amountDue: { type: Number },
    currency: { type: String },
    attempts: { type: Number },
    receipt: { type: String },
    status: { type: String },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
