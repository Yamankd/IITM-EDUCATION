const mongoose = require("mongoose");

const externalCertificateVerificationSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExternalStudent",
            required: true,
        },
        certificateNumber: {
            type: String,
            required: true,
            unique: true,
        },
        courseName: {
            type: String,
            required: true,
        },
        issueDate: {
            type: Date,
            default: Date.now,
        },
        fileUrl: {
            type: String, // Path to generated PDF
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ExternalCertificateVerification", externalCertificateVerificationSchema);
