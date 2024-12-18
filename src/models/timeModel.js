const mongoose = require("mongoose");

const timeSchema = new mongoose.Schema(
  {
    day: {
      type: String,
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
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Time = mongoose.model("Time", timeSchema);

module.exports = Time;
