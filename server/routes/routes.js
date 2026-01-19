const router = require('express').Router()
const { admin_Register, admin_Login, AdminDashboard } = require('../controllers/admin.controller')

const authCheck = require('../middlewares/authCheck')
const authorize = require('../middlewares/authorize')
const protect = require('../middlewares/tokenCheck')



router.post('/admin-signup', admin_Register)
router.post('/admin-login', admin_Login)


router.get('/auth-check', protect, authCheck)


module.exports = router;