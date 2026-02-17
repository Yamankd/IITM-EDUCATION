const ExternalStudent = require("../../models/ExternalStudent");
const { sendOtpEmail } = require("../../services/email.service");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id, isExternal: true, role: "external" }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @desc    Send OTP to email (Creates/Finds Student)
// @route   POST /api/external/auth/send-otp
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        let student = await ExternalStudent.findOne({ email });

        if (!student) {
            // Create new student record with just email/otp
            student = await ExternalStudent.create({
                email,
                otp,
                otpExpires,
                isEmailVerified: false
            });
        } else {
            // Update existing
            student.otp = otp;
            student.otpExpires = otpExpires;
            await student.save({ validateBeforeSave: false });
        }

        const result = await sendOtpEmail(email, otp);

        if (result.success) {
            res.status(200).json({ success: true, message: "OTP sent successfully" });
        } else {
            res.status(500).json({ message: "Failed to send OTP email" });
        }

    } catch (error) {
        console.error("External Send OTP Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Verify OTP
// @route   POST /api/external/auth/verify-otp
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

        const student = await ExternalStudent.findOne({ email }).select("+otp +otpExpires");

        if (!student) return res.status(404).json({ message: "User not found" });

        if (student.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        if (student.otpExpires < Date.now()) return res.status(400).json({ message: "OTP expired" });

        student.isEmailVerified = true;
        student.otp = undefined;
        student.otpExpires = undefined;
        await student.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, message: "Email verified" });

    } catch (error) {
        console.error("External Verify OTP Error:", error);
        res.status(500).json({ message: "Verification failed" });
    }
};

// @desc    Register External Student
// @route   POST /api/external/auth/register
const register = async (req, res) => {
    try {
        const { email, name, mobile, dob, gender, password, certificationDetails } = req.body;

        if (!email || !name || !mobile || !dob || !gender || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const student = await ExternalStudent.findOne({ email });
        if (!student) return res.status(404).json({ message: "Email verification required first" });
        if (!student.isEmailVerified) return res.status(400).json({ message: "Email not verified" });

        // Update profile details
        student.name = name;
        student.mobile = mobile;
        student.dob = dob;
        student.gender = gender;
        student.password = password; // Will be hashed by pre-save hook

        if (certificationDetails) {
            student.academicDetails = certificationDetails;
        }

        await student.save();

        // Generate Token
        const token = generateToken(student._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: student._id,
                name: student.name,
                email: student.email,
                role: student.role
            }
        });

    } catch (error) {
        console.error("External Register Error:", error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

// @desc    Login External Student
// @route   POST /api/external/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check for user
        const student = await ExternalStudent.findOne({ email }).select("+password");

        if (!student) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if email verified
        if (!student.isEmailVerified) {
            return res.status(401).json({ message: "Please verify your email first" });
        }

        // Check password
        if (student.password && (await student.matchPassword(password))) {
            res.json({
                success: true,
                token: generateToken(student._id),
                user: {
                    _id: student._id,
                    name: student.name,
                    email: student.email,
                    role: student.role,
                    profileImage: student.profileImage
                }
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }

    } catch (error) {
        console.error("External Login Error:", error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

module.exports = { sendOtp, verifyOtp, register, login };
