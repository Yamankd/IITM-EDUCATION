const router = require('express').Router();
const { admin_Login, AdminDashboard, admin_Logout, updateAdmin } = require('../controllers/admin.controller');
const authCheck = require('../middlewares/authCheck');
const protect = require('../middlewares/tokenCheck');

router.post('/admin-login', admin_Login);
router.post('/admin-logout', admin_Logout);
router.put('/update-admin', protect, updateAdmin);
router.get('/auth-check', protect, authCheck);
router.get('/admin/dashboard', protect, AdminDashboard);

module.exports = router;
