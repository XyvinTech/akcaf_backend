const mongoose = require("mongoose");

const NewsSchema = mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["latest", "business", "market", "economy"],
    },
    title: { type: String },
    content: { type: String },
    media: { type: String },
  },
  { timestamps: true }
);

const News = mongoose.model("News", NewsSchema);

module.exports = News;
