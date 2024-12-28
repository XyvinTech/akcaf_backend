const mongoose = require("mongoose");

const hallSchema = mongoose.Schema(
  {
    name: { type: String, trim: true },
    address: { type: String, trim: true },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Hall = mongoose.model("Hall", hallSchema);

module.exports = Hall;
