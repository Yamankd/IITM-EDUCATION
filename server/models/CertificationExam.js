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
        type: String,
    },
    codeLanguage: {
        type: String,
    },
    caseSensitive: {
        type: Boolean,
        default: false,
    },
    options: [
        {
            text: { type: String, required: true },
            imageUrl: { type: String },
        },
    ],
    correctOptionIndex: {
        type: Number,
    },
    correctOptionIndexes: {
        type: [Number],
    },
    correctAnswer: {
        type: String,
    },
    marks: {
        type: Number,
        default: 1,
    },
});

const certificationExamSchema = new mongoose.Schema(
    {
        // No courseId
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
        certificateConfig: {
            titleOverride: String,
            descriptionOverride: String,
            signatureName: String,
            signatureTitle: String,
            signatureImageUrl: String,
            logoImageUrl: String,
            backgroundImageUrl: String,
            showLogo: { type: Boolean, default: true },
            showDate: { type: Boolean, default: true },
            showId: { type: Boolean, default: true },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CertificationExam", certificationExamSchema);
