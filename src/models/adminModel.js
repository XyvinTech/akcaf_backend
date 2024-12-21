const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },
    password: { type: String, trim: true },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
