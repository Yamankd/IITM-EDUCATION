const Course = require("../models/courseModal");

// Create a new course
const createCourse = async (req, res) => {
    try {
        let { slug, title } = req.body;

        // Auto-generate slug if missing
        if (!slug && title) {
            slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        const course = new Course({
            ...req.body,
            slug,
            createdBy: req.user?.id || req.user?._id, // Handle both id and _id
        });
        await course.save();
        res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
        console.error("Create Course Error:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Course with this slug/title already exists" });
        }
        res.status(500).json({ message: "Failed to create course", error: error.message });
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch courses", error: error.message });
    }
};

// Get single course (by ID or Slug)
const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        let query = {};

        // Check if valid ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            query = { $or: [{ _id: id }, { slug: id }] };
        } else {
            query = { slug: id };
        }

        const course = await Course.findOne(query);
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch course", error: error.message });
    }
};

// Update course
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Course with this slug already exists" });
        }
        res.status(500).json({ message: "Failed to update course", error: error.message });
    }
};

// Delete course (Soft delete)
const deleteCourse = async (req, res) => {
    try {
        // We can do soft delete by setting isActive: false
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete course", error: error.message });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
};
