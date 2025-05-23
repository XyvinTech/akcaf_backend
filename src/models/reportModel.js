const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    content: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "reportType",
    },
    reportBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reportType: {
      type: String,
      enum: ["Feeds", "Chat", "User", "Message"],
    },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
