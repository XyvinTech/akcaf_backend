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
    name: {
      first: { type: String },
      middle: { type: String },
      last: { type: String },
    },
    uid: { type: String },
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
    phone: { type: String },
    bio: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "rejected", "deleted"],
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
