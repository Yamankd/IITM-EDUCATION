const router  = require('express').Router()
const { admin_Register , admin_Login } = require('../controllers/admin.controller')
const { hrSignup, hrLogin } = require('../controllers/hr.conroller')
const authorize = require('../middlewares/authorize')
const protect = require('../middlewares/tokenCheck')



router.post('/admin-signup',admin_Register)
router.post('/admin-login',admin_Login)
router.post('/hr/signup',protect,authorize,hrSignup)
router.post('/hr/login',hrLogin)



module.exports = router;