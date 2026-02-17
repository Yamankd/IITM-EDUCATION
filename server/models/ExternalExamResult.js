const mongoose = require("mongoose");

const externalExamResultSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExternalStudent",
            required: true,
        },
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam", // References the shared Exam definition
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
                isCorrect: Boolean,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("ExternalExamResult", externalExamResultSchema);
