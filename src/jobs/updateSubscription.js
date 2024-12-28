const cron = require("node-cron");
const moment = require("moment-timezone");
const Payment = require("../models/paymentModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const { getMessaging } = require("firebase-admin/messaging");
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
      const findUser = await User.findByIdAndUpdate(
        act.user,
        { status: "subscription_expired" },
        { new: true }
      );
      await act.save();
      const data = {
        user: act.user,
        read: false,
      };
      await Notification.create({
        users: data,
        subject: `Subscription expired!`,
        content: `Your subscription has expired. Please renew your subscription to continue using our platform.`,
        type: "in-app",
      });
      const message = {
        notification: {
          title: `Subscription expired!`,
          body: `Your subscription has expired. Please renew your subscription to continue using our platform.`,
        },
        token: findUser.fcm,
      };
      getMessaging()
        .send(message)
        .then((response) => {
          console.log("successfullyy sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }
  } catch (err) {
    console.error("Error updating promotions:", err);
  }
});
