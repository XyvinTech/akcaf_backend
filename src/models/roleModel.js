const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
  {
    roleName: { type: String, trim: true },
    permissions: [{ type: String }],
    description: { type: String, trim: true },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
