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
    batch: { type: String },
    designation: { type: String },
    image: { type: String },
    email: { type: String },
    phone: { type: String },
    bio: { type: String },
    status: {
      type: Boolean,
      default: false,
    },
    otp: { type: Number },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
