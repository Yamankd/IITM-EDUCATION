const router = require('express').Router();

const authRoutes = require('./auth.routes');
const courseRoutes = require('./course.routes');
const instructorRoutes = require('./instructor.routes');
const leadRoutes = require('./lead.routes');
const faqRoutes = require('./faq.routes');
const galleryRoutes = require('./gallery.routes');
const uploadRoutes = require('./upload.routes');
const aiRoutes = require('./ai.routes');
const studentRoutes = require('./student.routes');
const examRoutes = require('./exam.routes');

// Mount routes
router.use('/', authRoutes); // Auth routes often at root or /auth. Original was mixed. Keeping some at root like /admin-login
router.use('/courses', courseRoutes);
router.use('/instructors', instructorRoutes);
router.use('/leads', leadRoutes);
router.use('/faqs', faqRoutes);
router.use('/gallery', galleryRoutes);
router.use('/upload', uploadRoutes);
router.use('/ai', aiRoutes);
router.use('/students', studentRoutes);
router.use('/exams', examRoutes);

module.exports = router;
