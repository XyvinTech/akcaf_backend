const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    link: { type: String, trim: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    emiratesID: { type: String, trim: true },
    uid: { type: String, trim: true },
    memberId: { type: String, trim: true },
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
    email: { type: String, trim: true },
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
    address: { type: String, trim: true },
    company: {
      name: { type: String, trim: true },
      designation: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
      logo: { type: String },
    },
    social: [linkSchema],
    websites: [linkSchema],
    awards: [
      {
        image: { type: String },
        name: { type: String, trim: true },
        authority: { type: String, trim: true },
      },
    ],
    videos: [linkSchema],
    certificates: [linkSchema],
    reason: { type: String, trim: true },
    otp: { type: Number },
    fcm: { type: String },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notInterestedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
