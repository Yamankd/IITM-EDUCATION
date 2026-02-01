const Instructor = require("../models/instructor.model.js");

// Get all instructors
exports.getInstructors = async (req, res) => {
    try {
        const instructors = await Instructor.find().sort({ createdAt: -1 });
        res.status(200).json(instructors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new instructor
exports.createInstructor = async (req, res) => {
    try {
        const { name, role, image, social } = req.body;
        const newInstructor = new Instructor({ name, role, image, social });
        await newInstructor.save();
        res.status(201).json(newInstructor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update an instructor
exports.updateInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInstructor = await Instructor.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedInstructor) return res.status(404).json({ error: "Instructor not found" });
        res.status(200).json(updatedInstructor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete an instructor
exports.deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInstructor = await Instructor.findByIdAndDelete(id);
        if (!deletedInstructor) return res.status(404).json({ error: "Instructor not found" });
        res.status(200).json({ message: "Instructor deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
