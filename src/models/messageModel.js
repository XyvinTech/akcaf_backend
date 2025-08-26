const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    content: { type: String, required: true, trim: true },
    attachment: { type: String, trim: true },
    feed: { type: mongoose.Schema.Types.ObjectId, ref: "Feeds" },
    status: {
      type: String,
      trim: true,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageModel);

module.exports = Message;
