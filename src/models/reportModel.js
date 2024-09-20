const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    content: { type: String },
    reportBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reportTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reportType: {
      type: { String },
      enum: ["post", "chat", "user"],
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
