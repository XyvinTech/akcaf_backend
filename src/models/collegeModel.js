const mongoose = require("mongoose");

const collegeSchema = mongoose.Schema(
  {
    collegeName: { type: String },
    startYear: { type: Number },
    batch: [{ type: Number }],
    country: { type: String },
    state: { type: String },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const College = mongoose.model("College", collegeSchema);

module.exports = College;
