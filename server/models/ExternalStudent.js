const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const externalStudentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: String,
        },
        dob: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        profileImage: {
            type: String, // URL to image
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            default: "external_student",
        },
        otp: {
            type: String,
            select: false,
        },
        otpExpires: {
            type: Date,
            select: false,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        academicDetails: {
            college: { type: String },
            address: { type: String },
            city: { type: String },
            state: { type: String },
            qualification: { type: String },
            passingYear: { type: String },
        },
    },
    { timestamps: true }
);

// Encrypt password before saving
externalStudentSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare user password
externalStudentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("ExternalStudent", externalStudentSchema);
