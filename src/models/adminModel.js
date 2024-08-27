const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    designation: { type: String },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },
    password: { type: String },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
