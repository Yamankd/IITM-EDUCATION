const mongoose = require("mongoose");

const certificationResultSchema = new mongoose.Schema(
    {
        // Link to External Student
        externalStudentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExternalStudent",
            required: true,
        },
        // Link to Certification Exam
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CertificationExam",
            required: true,
        },
        // No courseId
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
                selectedOptionIndexes: [Number],
                textAnswer: String,
                isCorrect: Boolean,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("CertificationResult", certificationResultSchema);
