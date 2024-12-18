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
      type: String,
    },
    end: {
      type: String,
    },
  },
  { timestamps: true }
);

const Time = mongoose.model("Time", timeSchema);

module.exports = Time;
