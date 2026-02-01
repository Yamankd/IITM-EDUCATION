const router = require('express').Router();
const { uploadImage, getGalleryImages, deleteImage, updateImage, bulkDeleteImages } = require('../controllers/gallery.controller');
const { uploadFile } = require('../controllers/upload.controller');
const upload = require('../middlewares/multer');
const protect = require('../middlewares/tokenCheck');

// Gallery
router.post('/upload', protect, upload.array('images', 20), uploadImage);
router.get('/', getGalleryImages);
router.put('/:id', protect, updateImage);
router.post('/bulk-delete', protect, bulkDeleteImages);
router.delete('/:id', protect, deleteImage);

// General Upload (keeping here or moving to separate util route? Keeping separate might be better but for now let's group or separate? 
// The original file had a general /upload route. Let's make a separate utility route or keep it here? 
// Actually, let's make a separate common.routes.js for general uploads if needed, or put it in gallery if it's mostly image related. 
// However, the user uses /upload for instructor images too. So a separate file is better.
// I will create upload.routes.js for the generic upload.

module.exports = router;
