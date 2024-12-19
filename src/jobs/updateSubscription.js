const cron = require("node-cron");
const moment = require("moment-timezone");
const Payment = require("../models/paymentModel");
const User = require("../models/userModel");
require("dotenv").config();

cron.schedule("0 0 * * *", async () => {
  const now = moment().tz("Asia/Kolkata");

  try {
    const active = await Payment.find({
      expiryDate: { $lte: now.toDate() },
      status: "completed",
    });

    for (const act of active) {
      act.status = "expired";
      await User.findByIdAndUpdate(
        act.user,
        { status: "subscription_expired" },
        { new: true }
      );
      await act.save();
    }
  } catch (err) {
    console.error("Error updating promotions:", err);
  }
});
