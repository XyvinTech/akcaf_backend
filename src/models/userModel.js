const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      first: { type: String },
      middle: { type: String },
      last: { type: String },
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },
    batch: { type: Number },
    designation: {
      type: String,
      enum: ["president", "secretary", "treasurer", "rep", "member"],
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
    otp: { type: Number },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
