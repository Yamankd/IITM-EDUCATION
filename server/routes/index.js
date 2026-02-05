const router = require('express').Router();

const authRoutes = require('./auth.routes');
const courseRoutes = require('./course.routes');
const leadRoutes = require('./lead.routes');
const faqRoutes = require('./faq.routes');
const galleryRoutes = require('./gallery.routes');
const uploadRoutes = require('./upload.routes');
const studentRoutes = require('./student.routes');
const examRoutes = require('./exam.routes');


const settingsRoutes = require('./settings.routes');
router.use('/', authRoutes); // Auth routes often at root or /auth. Original was mixed. Keeping some at root like /admin-login
router.use('/courses', courseRoutes);
router.use('/leads', leadRoutes);
router.use('/faqs', faqRoutes);
router.use('/gallery', galleryRoutes);
router.use('/upload', uploadRoutes);
router.use('/students', studentRoutes);
router.use('/exams', examRoutes);
router.use('/ai', require('./ai.routes'));
router.use('/instructors', require('./instructor.routes'));
router.use('/settings', settingsRoutes);

module.exports = router;
