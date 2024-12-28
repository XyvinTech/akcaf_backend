const mongoose = require("mongoose");

const collegeSchema = mongoose.Schema(
  {
    collegeName: { type: String, trim: true },
    startYear: { type: Number },
    batch: [{ type: Number }],
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    course: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const College = mongoose.model("College", collegeSchema);

module.exports = College;
