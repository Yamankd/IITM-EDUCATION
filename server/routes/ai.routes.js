const express = require('express');
const router = express.Router();
const { generateCourseDetails, generateExamQuestions } = require('../controllers/ai.controller');
const protect = require('../middlewares/tokenCheck'); // Assuming we want it protected

// Route to generate course details
router.post('/generate', protect, generateCourseDetails);
router.post('/generate-questions', protect, generateExamQuestions);

module.exports = router;
