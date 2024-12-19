const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    name: { type: String },
    link: { type: String },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    emiratesID: { type: String },
    uid: { type: String },
    memberId: { type: String },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    batch: { type: Number },
    role: {
      type: String,
      enum: ["president", "secretary", "treasurer", "rep", "member"],
      default: "member",
    },
    image: { type: String },
    email: { type: String },
    phone: { type: String, trim: true },
    bio: { type: String },
    status: {
      type: String,
      enum: [
        "active",
        "inactive",
        "suspended",
        "deleted",
        "blocked",
        "awaiting_payment",
        "subscription_expired",
      ],
      default: "inactive",
    },
    address: { type: String },
    company: {
      name: { type: String },
      designation: { type: String },
      phone: { type: String },
      address: { type: String },
      logo: { type: String },
    },
    social: [linkSchema],
    websites: [linkSchema],
    awards: [
      {
        image: { type: String },
        name: { type: String },
        authority: { type: String },
      },
    ],
    videos: [linkSchema],
    certificates: [linkSchema],
    reason: { type: String },
    otp: { type: Number },
    fcm: { type: String },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notInterestedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
