const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema(
  {
    day: {
      type: String,
      trim: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    time: {
      type: {
        start: {
          type: String,
          trim: true,
        },
        end: {
          type: String,
          trim: true,
        },
      },
    },
    status: {
      type: String,
      trim: true,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hall",
    },
    date: {
      type: Date,
    },
    eventName: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
