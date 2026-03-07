const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: false, // Made optional to support external students
        },
        externalStudentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExternalStudent",
        },
        isExternal: {
            type: Boolean,
            default: false,
        },
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        totalQuestions: {
            type: Number,
            required: true,
        },
        correctAnswers: {
            type: Number,
            required: true,
        },
        scorePercentage: {
            type: Number,
            required: true,
        },
        isPassed: {
            type: Boolean,
            required: true,
        },
        answers: [
            {
                questionId: mongoose.Schema.Types.ObjectId,
                selectedOptionIndex: Number,
                selectedOptionIndexes: [Number], // Added to support multiple-choice
                textAnswer: String, // Added to support fill-blank and code
                isCorrect: Boolean,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
