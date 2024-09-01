const mongoose = require("mongoose");

const feedsSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Information", "Job", "Funding", "Requirement"],
    },
    media: { type: String },
    link: { type: String },
    content: { type: String },
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        comment: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["published", "unpublished"],
      default: "published",
    },
  },
  { timestamps: true }
);

const Feeds = mongoose.model("Feeds", feedsSchema);

module.exports = Feeds;
