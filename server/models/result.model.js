const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
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
                isCorrect: Boolean,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
