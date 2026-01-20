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

router.get('/auth-check', protect, authCheck)

router.get('/admin/dashboard', protect, AdminDashboard);


module.exports = router;