const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    users: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        read: { type: Boolean, default: false },
      },
    ],
    subject: { type: String, trim: true },
    content: { type: String, trim: true },
    media: { type: String },
    link: { type: String },
    type: {
      type: String,
      enum: ["email", "in-app"],
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
