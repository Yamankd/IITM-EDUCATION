const router = require('express').Router();
const { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } = require('../controllers/course.controller');
const { generateCourseDetails } = require('../controllers/ai.controller');
const protect = require('../middlewares/tokenCheck');

// Course CRUD
router.post('/', protect, createCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.put('/:id', protect, updateCourse);
router.delete('/:id', protect, deleteCourse);

// AI Generation (Related to courses)
router.post('/ai/generate', protect, generateCourseDetails);

module.exports = router;
