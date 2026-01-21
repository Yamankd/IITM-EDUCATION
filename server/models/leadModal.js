const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            default: null,
        },
        message: {
            type: String,
            default: "",
        },
        address: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            enum: ["enquiry", "newsletter"], // Keeping enum for future extensibility even if we skip newsletter frontend for now
            default: "enquiry",
        },
        status: {
            type: String,
            enum: ["new", "contacted", "resolved"],
            default: "new",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
