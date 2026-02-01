const router = require('express').Router();
const { uploadFile } = require('../controllers/upload.controller');
const upload = require('../middlewares/multer');
const protect = require('../middlewares/tokenCheck');

router.post('/', protect, upload.single('file'), uploadFile);

module.exports = router;
