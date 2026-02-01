const router = require('express').Router();
const { getFaqs, createFaq, deleteFaq, reorderFaqs } = require('../controllers/faq.controller');
const protect = require('../middlewares/tokenCheck');

router.get('/', getFaqs);
router.post('/', protect, createFaq);
router.put('/reorder', protect, reorderFaqs);
router.delete('/:id', protect, deleteFaq);

module.exports = router;
