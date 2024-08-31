const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "users.userType",
        },
        userType: {
          type: String,
          enum: ["User", "Admin"],
          required: true,
        },
      },
    ],
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    unreadCount: { type: Map, of: Number, default: {} },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
