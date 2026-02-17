const Student = require("../models/student.model");
const { sendWelcomeEmail, sendOtpEmail } = require("../services/email.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helper to generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @desc    Send OTP to email
// @route   POST /api/certification/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Check if student exists
        let student = await Student.findOne({ email });

        if (student) {
            // Update existing student with new OTP
            // We use direct update to avoid validation/hooks issues if any
            // And to set select: false fields
            student.otp = otp;
            student.otpExpires = otpExpires;
            await student.save({ validateBeforeSave: false });
        } else {
            // Check if we should create a temporary record or just wait for registration?
            // User requested "OTP first", so we need to store OTP somewhere.
            // We can create a partial student record or use a separate OTP collection.
            // "Try to use existing things" -> Create a Student record but mark as inactive/unverified maybe?
            // Or just store OTP in Student model. The Student schema requires name/password etc.
            // If student doesn't exist, we can't save OTP on a non-existent document.
            // Upsert approach: Create a temporary student doc?
            // Constraint: Student model requires 'name', 'password', 'mobile'.
            // If we blindly create a student here, we'll fail validation.
            // STRATEGY: We will find or create a Student. 
            // If creating, we'll put dummy data and update it later in registration.

            // Actually, better flow:
            // 1. User enters Email.
            // 2. We check if email exists.
            //    - If YES: Send OTP.
            //    - If NO: We can't save OTP to a non-existent student.
            //    - We need to CREATE the student record at this stage to store the OTP?
            //    - OR manage OTPs in a separate lightweight model?
            //    - "Use existing things" implies using Student model.
            //    - Let's create a minimal student record with dummy password/name if needed, OR
            //    - Ask user for Name/Email first, then OTP?
            //    - User requirement: "ask for user registration via email otp".
            //    - Typical flow: Email -> OTP -> Details.
            //    - Problem: To store OTP in Student, we need a Student document.
            //    - Solution: We will create a student with `isEmailVerified: false` and dummy data if needed, 
            //      or perhaps we can make fields optional? No, checks in model are `required: true`.

            // ALTERNATIVE: Use a simple in-memory cache or a temporary collection for OTPs?
            // Given "use existing things", I will create a temporary "OTP" collection implicitly via a new helper model OR
            // I will relax the required fields in Student model? No, that's risky.

            // Let's create a simple 'Otps' collection/model? It's new but clean.
            // OR use a standard pattern: `sendOtp` sends the OTP but also returns a hash to the client?
            // No, that's insecure.

            // LET'S GO WITH: Create a dummy student record.
            const dummyPassword = await bcrypt.hash(generateOTP(), 10);
            student = await Student.create({
                name: "Guest User",
                email: email,
                mobile: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
                password: dummyPassword,
                isEmailVerified: false,
                otp: otp,
                otpExpires: otpExpires
            });
        }

        const result = await sendOtpEmail(email, otp);

        if (result.success) {
            res.status(200).json({ success: true, message: "OTP sent successfully" });
        } else {
            res.status(500).json({ message: "Failed to send OTP email" });
        }

    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ message: "Failed to send OTP", error: error.message });
    }
};

// @desc    Verify OTP
// @route   POST /api/certification/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        // We need to select otp and otpExpires explicitly as they are select: false
        const student = await Student.findOne({ email }).select("+otp +otpExpires");

        if (!student) {
            return res.status(400).json({ message: "User not found" });
        }

        if (student.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (student.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        // OTP Valid
        student.isEmailVerified = true;
        student.otp = undefined;
        student.otpExpires = undefined;
        await student.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ message: "Verification failed" });
    }
};

// @desc    Complete Registration with Details
// @route   POST /api/certification/register
// @access  Public
const registerDetails = async (req, res) => {
    try {
        const { email, name, mobile, password, certificationDetails } = req.body;

        // Note: Password usually collected during registration.
        // If user already exists, we might not want to overwrite password unless it was a dummy one?
        // Let's assume this finishes the "Guest User" to "Real User" conversion.

        if (!email || !name || !mobile) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(400).json({ message: "User not found. Please verify email first." });
        }

        if (!student.isEmailVerified) {
            return res.status(400).json({ message: "Email not verified. Please verify OTP first." });
        }

        // Update student details
        student.name = name;
        student.mobile = mobile;
        if (password) {
            // Password hashing is handled by pre-save hook, but only if modified.
            // If we just set student.password = plainText, the hook in model might re-hash it?
            // Model: `if (!this.isModified("password")) next(); ... hash...`
            // Yes, simply setting it triggers the hook.
            student.password = password;
        }

        if (certificationDetails) {
            student.certificationDetails = certificationDetails;
        }

        await student.save();

        const token = generateToken(student._id);

        res.status(200).json({
            success: true,
            message: "Registration completed successfully",
            token,
            user: {
                _id: student._id,
                name: student.name,
                email: student.email,
                mobile: student.mobile
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
    registerDetails
};
