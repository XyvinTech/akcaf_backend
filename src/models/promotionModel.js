const mongoose = require("mongoose");

const promotionSchema = mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    type: {
      type: String,
      enum: ["banner", "video", "poster", "notice"],
    },
    startDate: { type: Date },
    endDate: { type: Date },
    media: { type: String },
    link: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "inactive",
    },
  },
  { timestamps: true }
);

const Promotion = mongoose.model("Promotion", promotionSchema);

module.exports = Promotion;
