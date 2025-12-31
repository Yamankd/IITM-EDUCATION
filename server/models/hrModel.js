const mongoose = require("mongoose");

const hrSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      default: "HR"
    },

    permissions: {
      type: [String],
      default: [
        "ADD_STUDENT",
        "EDIT_STUDENT",
        "VIEW_STUDENT"
      ]
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastLogin: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("HR", hrSchema);
