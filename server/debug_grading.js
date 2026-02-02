const mongoose = require("mongoose");
const Exam = require("./models/exam.model");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const fs = require('fs');

const inspectExams = async () => {
    await connectDB();
    try {
        const exams = await Exam.find().limit(5);
        const output = exams.map(exam => ({
            title: exam.title,
            id: exam._id,
            questions: exam.questions.map((q, i) => ({
                index: i,
                type: q.questionType,
                id: q._id,
                correctOptionIndex: q.correctOptionIndex,
                correctOptionIndexes: q.correctOptionIndexes,
                correctAnswer: q.correctAnswer,
                optionsCount: q.options.length
            }))
        }));

        fs.writeFileSync('debug_exam.json', JSON.stringify(output, null, 2));
        console.log("Wrote debug_exam.json");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        mongoose.disconnect();
    }
};

inspectExams();
