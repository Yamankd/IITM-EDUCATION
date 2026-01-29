const router = require('express').Router()
const { admin_Register, admin_Login, AdminDashboard, admin_Logout } = require('../controllers/admin.controller')
const { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } = require('../controllers/course.controller')

const authCheck = require('../middlewares/authCheck')
const authorize = require('../middlewares/authorize')
const protect = require('../middlewares/tokenCheck')



// router.post('/admin-signup', admin_Register)
router.post('/admin-login', admin_Login)
router.post('/admin-logout', admin_Logout)


// Course Routes
router.post('/courses', protect, createCourse);
router.get('/courses', getAllCourses);
router.get('/courses/:id', getCourseById);
router.put('/courses/:id', protect, updateCourse);
router.delete('/courses/:id', protect, deleteCourse);

// FAQ Routes
const { getFaqs, createFaq, deleteFaq, reorderFaqs } = require('../controllers/faq.controller');
router.get('/faqs', getFaqs);
router.post('/faqs', protect, createFaq);
router.put('/faqs/reorder', protect, reorderFaqs);
router.delete('/faqs/:id', protect, deleteFaq);

// Lead Routes
const { createLead, getLeads } = require('../controllers/lead.controller');
router.post('/leads', createLead);
router.get('/leads', protect, getLeads);

router.get('/auth-check', protect, authCheck)

router.get('/admin/dashboard', protect, AdminDashboard);

// Gallery Routes
const { uploadImage, getGalleryImages, deleteImage, updateImage, bulkDeleteImages } = require('../controllers/gallery.controller');
const upload = require('../middlewares/multer');

router.post('/gallery/upload', protect, upload.array('images', 20), uploadImage);
router.get('/gallery', getGalleryImages);
router.put('/gallery/:id', protect, updateImage);
router.post('/gallery/bulk-delete', protect, bulkDeleteImages);
router.delete('/gallery/:id', protect, deleteImage);



// Upload Route
const { uploadFile } = require('../controllers/upload.controller');
router.post('/upload', protect, upload.single('file'), uploadFile);

// AI Route
module.exports = router;