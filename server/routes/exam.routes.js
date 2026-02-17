const express = require("express");
const router = express.Router();
const {
    createExam,
    getExamsByCourse,
    getExamById,
    getExamForAdmin,
    submitExam,
    getStudentResults,
    deleteExam,
    getExamsInCourseForAdmin,
    getAllExamsForExternal,
    getCertificationExams
} = require("../controllers/exam.controller");
const { protectStudent } = require("../middlewares/studentAuth");
const { protectExternal } = require("../middleware/authExternal.middleware");
const protect = require("../middlewares/tokenCheck"); // Admin middleware

// Admin Routes
router.post("/", protect, createExam);
router.get("/admin/certifications", protect, getCertificationExams); // New Route
router.get("/admin/:examId", protect, getExamForAdmin);
router.get("/admin/course/:courseId/all", protect, getExamsInCourseForAdmin); // Admin explicit full fetch
// router.get("/course/:courseId/all", protect, getExamsByCourse); // REMOVED: Conflict with student route below
router.delete("/:examId", protect, deleteExam);

router.get("/course/:courseId/all", protectStudent, getExamsByCourse); // Student sees all
router.get("/external/all", protectExternal, getAllExamsForExternal); // External Student sees all active
router.post("/external/submit", protectExternal, submitExam);
router.get("/external/my-results", protectExternal, getStudentResults);
router.get("/external/:examId", protectExternal, getExamById); // External fetch single exam

router.get("/my-results", protectStudent, getStudentResults); // Specific route first
router.get("/:examId", protectStudent, getExamById); // Dynamic route last
router.post("/submit", protectStudent, submitExam);

module.exports = router;
