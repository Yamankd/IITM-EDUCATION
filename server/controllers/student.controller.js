const Student = require("../models/student.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Ensure bcrypt is used for manual check if needed, though model handles it
const { sendWelcomeEmail } = require("../services/email.service");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const generateRandomPassword = () => {
    return "Student@" + Math.floor(1000 + Math.random() * 9000);
};

// @desc    Register a new student
// @route   POST /api/students/register
// @access  Public
const registerStudent = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        // Check if student exists
        const studentExists = await Student.findOne({ email });
        if (studentExists) {
            return res.status(400).json({ message: "Student already exists" });
        }

        // Create student
        const student = await Student.create({
            name,
            email,
            password, // Pre-save hook will hash this
            mobile,
        });

        if (student) {
            res.status(201).json({
                _id: student._id,
                name: student.name,
                email: student.email,
                token: generateToken(student._id),
            });
        } else {
            res.status(400).json({ message: "Invalid student data" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Create student by Admin
// @route   POST /api/students/create-by-admin
// @access  Private (Admin)
const createStudentByAdmin = async (req, res) => {
    try {
        const { name, email, mobile, courseId } = req.body;

        if (!name || !email || !mobile || !courseId) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        // Check if student exists
        const studentExists = await Student.findOne({ email });
        if (studentExists) {
            return res.status(400).json({ message: "Student with this email already exists" });
        }

        const generatedPassword = generateRandomPassword();

        // Create student
        const student = await Student.create({
            name,
            email,
            password: generatedPassword, // Pre-save hook will hash this
            mobile,
            enrolledCourses: [courseId] // Auto-enroll
        });

        if (student) {
            // Send welcome email with credentials (non-blocking)
            sendWelcomeEmail(email, generatedPassword)
                .then((result) => {
                    if (result.success) {
                        console.log(`✅ Welcome email sent to ${email}`);
                    } else {
                        console.error(`❌ Failed to send email to ${email}:`, result.error);
                    }
                })
                .catch((error) => {
                    console.error(`❌ Email sending error for ${email}:`, error);
                });

            res.status(201).json({
                _id: student._id,
                name: student.name,
                email: student.email,
                generatedPassword: generatedPassword, // Return plain text ONCE
                message: "Student created successfully. Login credentials have been sent to their email."
            });
        } else {
            res.status(400).json({ message: "Invalid student data" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Login student
// @route   POST /api/students/login
// @access  Public
const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for student email
        const student = await Student.findOne({ email });

        if (student && (await student.matchPassword(password))) {
            res.json({
                _id: student._id,
                name: student.name,
                email: student.email,
                token: generateToken(student._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private
const getStudentProfile = async (req, res) => {
    try {
        // req.student will be set by middleware
        const student = await Student.findById(req.student.id).select("-password").populate("enrolledCourses");

        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: "Student not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get all students (Admin only)
// @route   GET /api/students
// @access  Private (Admin)
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .select("-password")
            .populate("enrolledCourses", "title category")
            .sort({ createdAt: -1 });

        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update student (Admin only)
// @route   PUT /api/students/:id
// @access  Private (Admin)
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, mobile, enrolledCourses } = req.body;

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== student.email) {
            const emailExists = await Student.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        // Use findByIdAndUpdate to avoid triggering password hash middleware
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            {
                name: name || student.name,
                email: email || student.email,
                mobile: mobile || student.mobile,
                enrolledCourses: enrolledCourses || student.enrolledCourses
            },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedStudent);
    } catch (error) {
        console.error("Update student error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Delete student (Admin only)
// @route   DELETE /api/students/:id
// @access  Private (Admin)
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        await Student.findByIdAndDelete(id);
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    registerStudent,
    loginStudent,
    getStudentProfile,
    createStudentByAdmin,
    getAllStudents,
    updateStudent,
    deleteStudent
};
