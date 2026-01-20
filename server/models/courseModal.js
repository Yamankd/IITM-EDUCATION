const mongoose = require("mongoose");

const syllabusSchema = new mongoose.Schema({
  week: String,
  title: String,
  topics: [String],
});

const instructorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  image: String,
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String, // Short desc for cards
    longDescription: String, // Detailed desc for page
    category: String,
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    duration: String, // e.g. "12 weeks"
    price: { type: Number, default: 0 },
    image: String, // Thumbnail URL

    // Stats
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    students: { type: Number, default: 0 },

    learningOutcomes: [String],
    requirements: [String],

    syllabus: [syllabusSchema],
    instructor: instructorSchema,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
