const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: String,

    duration: String, // 6 months, 1 year

    fees: Number,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
