const router = require('express').Router();
const { getInstructors, createInstructor, updateInstructor, deleteInstructor } = require('../controllers/instructor.controller.js');
const protect = require('../middlewares/tokenCheck');

router.get('/', getInstructors);
router.post('/', protect, createInstructor);
router.put('/:id', protect, updateInstructor);
router.delete('/:id', protect, deleteInstructor);

module.exports = router;
