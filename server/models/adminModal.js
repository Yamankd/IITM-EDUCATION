const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      default: "ADMIN"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    mobile: {
      type: String,
      default: ""
    },

    contactEmail: {
      type: String,
      default: ""
    },

    lastLogin: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
