const router = require('express').Router();
const { getSettings, updateSettings } = require('../controllers/settings.controller');
const protect = require('../middlewares/tokenCheck');

// Public route to get settings (for loading scripts/meta on frontend)
router.get('/', getSettings);

// Protected route to update settings (Admin only)
router.put('/', protect, updateSettings);

module.exports = router;
