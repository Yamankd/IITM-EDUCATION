const router = require('express').Router();
const { createLead, getLeads, updateLead, deleteLead } = require('../controllers/lead.controller');
const protect = require('../middlewares/tokenCheck');

router.post('/', createLead);
router.get('/', protect, getLeads);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);

module.exports = router;
