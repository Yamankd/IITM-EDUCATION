const express = require("express");
const router = express.Router();
const {
    createCertificationExam,
    getCertificationExams,
    getAllExamsForExternal,
    getCertificationExamById,
    submitCertificationExam,
    getMyCertificationResults,
    deleteCertificationExam,
    updateCertificationExam,
    getCertificationExamForAdmin,
    generateCertificate
} = require("../controllers/certificationExam.controller");

const { protectExternal } = require("../middleware/authExternal.middleware");
const protect = require("../middlewares/tokenCheck"); // Admin middleware

// Admin Routes
router.post("/", protect, createCertificationExam);
router.put("/:id", protect, updateCertificationExam);
router.get("/admin/all", protect, getCertificationExams);
router.get("/admin/:examId", protect, getCertificationExamForAdmin);
router.delete("/:id", protect, deleteCertificationExam);

// External Student Routes
router.get("/external/all", protectExternal, getAllExamsForExternal);
router.post("/submit", protectExternal, submitCertificationExam);
router.get("/my-results", protectExternal, getMyCertificationResults);
router.get("/certificate/:resultId", generateCertificate); // No middleware - handles auth internally
router.get("/:examId", protectExternal, getCertificationExamById);

module.exports = router;
