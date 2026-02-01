const Exam = require("../models/exam.model");
const Result = require("../models/result.model");
const Course = require("../models/courseModal");

// @desc    Create or Update Exam (Admin)
// @route   POST /api/exams
// @access  Private (Admin)
const createExam = async (req, res) => {
    try {
        const { examId, courseId, title, description, durationMinutes, passingScore, questions, randomizeQuestions, randomizeAnswers } = req.body;

        if (examId) {
            // Update existing exam
            const exam = await Exam.findById(examId);
            if (!exam) {
                return res.status(404).json({ message: "Exam not found" });
            }

            exam.title = title || exam.title;
            exam.description = description || exam.description;
            exam.durationMinutes = durationMinutes || exam.durationMinutes;
            exam.passingScore = passingScore || exam.passingScore;
            exam.questions = questions || exam.questions;
            exam.randomizeQuestions = randomizeQuestions !== undefined ? randomizeQuestions : exam.randomizeQuestions;
            exam.randomizeAnswers = randomizeAnswers !== undefined ? randomizeAnswers : exam.randomizeAnswers;

            const updatedExam = await exam.save();
            return res.json(updatedExam);
        }

        // Create new exam
        const newExam = new Exam({
            courseId,
            title,
            description,
            durationMinutes,
            passingScore,
            questions,
            randomizeQuestions: randomizeQuestions || false,
            randomizeAnswers: randomizeAnswers || false,
        });

        const savedExam = await newExam.save();
        res.status(201).json(savedExam);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get All Exams for a Course (Admin/Student) - STRIPPED
// @route   GET /api/exams/course/:courseId/all
// @access  Private
const getExamsByCourse = async (req, res) => {
    try {
        const exams = await Exam.find({ courseId: req.params.courseId }).select("-questions.correctOptionIndex -questions.correctOptionIndexes -questions.correctAnswer");
        res.json(exams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get All Exams for a Course (Admin) - FULL DETAILS
// @route   GET /api/exams/admin/course/:courseId/all
// @access  Private (Admin)
const getExamsInCourseForAdmin = async (req, res) => {
    try {
        const exams = await Exam.find({ courseId: req.params.courseId });
        res.json(exams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// @desc    Get Single Exam by ID (Student/Admin)
// @route   GET /api/exams/:examId
// @access  Private
const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.examId).select("-questions.correctOptionIndex -questions.correctOptionIndexes -questions.correctAnswer");
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        // Apply randomization if enabled
        let examData = exam.toObject();

        // Randomize questions order
        if (examData.randomizeQuestions && examData.questions && examData.questions.length > 0) {
            examData.questions = shuffleArray(examData.questions);
        }

        // Randomize answer options for each question
        if (examData.randomizeAnswers && examData.questions && examData.questions.length > 0) {
            examData.questions = examData.questions.map(question => {
                // Only randomize if question has options (MCQ, True/False)
                if (question.options && question.options.length > 0) {
                    // Create a mapping of old index to new index
                    const indexMap = question.options.map((_, idx) => idx);
                    const shuffledIndices = shuffleArray(indexMap);

                    // Shuffle the options
                    const shuffledOptions = shuffledIndices.map(oldIdx => question.options[oldIdx]);

                    return {
                        ...question,
                        options: shuffledOptions
                    };
                }
                return question;
            });
        }

        res.json(examData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get Exam for Admin (Full Details)
// @route   GET /api/exams/admin/:examId
// @access  Private (Admin)
const getExamForAdmin = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.json(exam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Submit Exam
// @route   POST /api/exams/submit
// @access  Private (Student)
const submitExam = async (req, res) => {
    try {
        const { examId, answers } = req.body;
        const studentId = req.student.id;

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        let correctCount = 0;
        const processedAnswers = [];

        // Calculate score with support for different question types
        answers.forEach(ans => {
            const question = exam.questions.id(ans.questionId);
            if (question) {
                let isCorrect = false;

                // Check answer based on question type
                switch (question.questionType) {
                    case 'single-choice':
                    case 'true-false':
                        // Single answer comparison
                        isCorrect = question.correctOptionIndex === ans.selectedOptionIndex;
                        break;

                    case 'multiple-choice':
                        // Multiple answers comparison (array)
                        if (Array.isArray(ans.selectedOptionIndexes) && Array.isArray(question.correctOptionIndexes)) {
                            const sorted1 = [...ans.selectedOptionIndexes].sort();
                            const sorted2 = [...question.correctOptionIndexes].sort();
                            isCorrect = JSON.stringify(sorted1) === JSON.stringify(sorted2);
                        }
                        break;

                    case 'fill-blank':
                        // Text comparison with case sensitivity option
                        if (ans.textAnswer && question.correctAnswer) {
                            const studentAnswer = question.caseSensitive
                                ? ans.textAnswer.trim()
                                : ans.textAnswer.trim().toLowerCase();
                            const correctAnswer = question.caseSensitive
                                ? question.correctAnswer.trim()
                                : question.correctAnswer.trim().toLowerCase();
                            isCorrect = studentAnswer === correctAnswer;
                        }
                        break;

                    case 'code':
                        // Code comparison (trimmed)
                        if (ans.textAnswer && question.correctAnswer) {
                            isCorrect = ans.textAnswer.trim() === question.correctAnswer.trim();
                        }
                        break;

                    default:
                        // Fallback to single-choice for backward compatibility
                        isCorrect = question.correctOptionIndex === ans.selectedOptionIndex;
                }

                if (isCorrect) correctCount++;

                processedAnswers.push({
                    questionId: ans.questionId,
                    selectedOptionIndex: ans.selectedOptionIndex,
                    selectedOptionIndexes: ans.selectedOptionIndexes,
                    textAnswer: ans.textAnswer,
                    isCorrect
                });
            }
        });

        const totalQuestions = exam.questions.length;
        const scorePercentage = (correctCount / totalQuestions) * 100;
        const isPassed = scorePercentage >= exam.passingScore;

        // Save Result
        const result = await Result.create({
            studentId,
            examId,
            courseId: exam.courseId,
            totalQuestions,
            correctAnswers: correctCount,
            scorePercentage,
            isPassed,
            answers: processedAnswers
        });

        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get Student Results
// @route   GET /api/exams/my-results
// @access  Private (Student)
const getStudentResults = async (req, res) => {
    try {
        const results = await Result.find({ studentId: req.student.id })
            .populate("courseId", "title")
            .populate("examId", "title")
            .sort("-createdAt");

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

// @desc    Delete exam (Admin only)
// @route   DELETE /api/exams/:examId
// @access  Private (Admin)
const deleteExam = async (req, res) => {
    try {
        const { examId } = req.params;

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        await Exam.findByIdAndDelete(examId);
        res.json({ message: "Exam deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    createExam,
    getExamsByCourse,
    getExamById,
    getExamForAdmin,
    submitExam,
    getStudentResults,
    deleteExam,
    getExamsInCourseForAdmin
};
