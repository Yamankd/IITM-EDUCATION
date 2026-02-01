const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    questionType: {
        type: String,
        enum: ['single-choice', 'multiple-choice', 'true-false', 'fill-blank', 'code'],
        default: 'single-choice',
    },
    imageUrl: {
        type: String, // Optional image for the question
    },
    codeLanguage: {
        type: String, // For code questions: 'javascript', 'python', 'java', etc.
    },
    caseSensitive: {
        type: Boolean,
        default: false, // For fill-blank questions
    },
    options: [
        {
            text: { type: String, required: true },
            imageUrl: { type: String }, // Optional image for options
        },
    ],
    correctOptionIndex: {
        type: Number, // For single-choice and true-false (0 or 1)
    },
    correctOptionIndexes: {
        type: [Number], // For multiple-choice (array of correct indexes)
    },
    correctAnswer: {
        type: String, // For fill-blank and code questions
    },
    marks: {
        type: Number,
        default: 1,
    },
});

const examSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: String,
        durationMinutes: {
            type: Number,
            default: 60,
        },
        passingScore: {
            type: Number,
            default: 40, // percentage
        },
        randomizeQuestions: {
            type: Boolean,
            default: false,
        },
        randomizeAnswers: {
            type: Boolean,
            default: false,
        },
        questions: [questionSchema],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
