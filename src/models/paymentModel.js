const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    gatewayId: { type: String },
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
