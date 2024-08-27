const mongoose = require("mongoose");

const collegeSchema = mongoose.Schema(
  {
    collegeName: { type: String },
    batch: [{ type: String }],
    description: { type: String },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const College = mongoose.model("College", collegeSchema);

module.exports = College;
