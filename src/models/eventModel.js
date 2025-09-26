const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, trim: true },
    description: { type: String, trim: true },
    type: {
      type: String,
      enum: ["Online", "Offline"],
    },
    image: { type: String },
    startDate: { type: Date },
    startTime: { type: Date },
    endDate: { type: Date },
    endTime: { type: Date },
    posterVisibilityStartDate: { type: Date },
    posterVisibilityEndDate: { type: Date },
    platform: { type: String, trim: true },
    link: { type: String, trim: true },
    venue: { type: String, trim: true },
    organiserName: { type: String, trim: true },
    speakers: [
      {
        name: { type: String, trim: true },
        designation: { type: String, trim: true },
        role: { type: String, trim: true },
        image: { type: String },
      },
    ],
    status: {
      type: String,
      trim: true,
      enum: ["pending", "live", "completed", "cancelled"],
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
