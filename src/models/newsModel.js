const mongoose = require("mongoose");

const NewsSchema = mongoose.Schema(
  {
    category: {
      type: String,
      trim: true,
      enum: [
        "Latest",
        "Current Affairs",
        "Trending",
        "History",
        "Entertainment",
        "Volunteering",
        "Events/ Programmes",
      ],
    },
    title: { type: String, trim: true },
    content: { type: String, trim: true },
    media: { type: String },
    status: {
      type: String,
      trim: true,
      enum: ["published", "unpublished"],
      default: "unpublished",
    },
  },
  { timestamps: true }
);

const News = mongoose.model("News", NewsSchema);

module.exports = News;
