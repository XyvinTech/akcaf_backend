const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    eventName: { type: String },
    type: {
      type: String,
      enum: ["online", "offline"],
    },
    image: { type: String },
    eventDate: { type: Date },
    eventTime: { type: Date },
    platform: { type: String },
    link: { type: String },
    speakers: [
      {
        name: { type: String },
        designation: { type: String },
        role: { type: String },
        image: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "live", "completed"],
      default: "pending",
    },
    rsvp: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
