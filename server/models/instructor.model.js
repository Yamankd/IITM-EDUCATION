const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, required: true },
    social: {
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
    }
}, { timestamps: true });

module.exports = mongoose.model("Instructor", instructorSchema);
