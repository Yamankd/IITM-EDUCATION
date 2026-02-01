const express = require("express");
const router = express.Router();
const {
    registerStudent,
    loginStudent,
    getStudentProfile,
    createStudentByAdmin,
    getAllStudents,
    updateStudent,
    deleteStudent
} = require("../controllers/student.controller");
const { protectStudent } = require("../middlewares/studentAuth");
const protect = require("../middlewares/tokenCheck"); // Admin Middleware

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/profile", protectStudent, getStudentProfile);

// Admin Routes
router.get("/", protect, getAllStudents);
router.post("/create-by-admin", protect, createStudentByAdmin);
router.put("/:id", protect, updateStudent);
router.delete("/:id", protect, deleteStudent);

module.exports = router;
