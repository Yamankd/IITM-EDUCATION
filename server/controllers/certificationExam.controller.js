const CertificationExam = require("../models/CertificationExam");
const CertificationResult = require("../models/CertificationResult");

// @desc    Create Certification Exam (Admin)
// @route   POST /api/certification-exams
// @access  Private (Admin)
const createCertificationExam = async (req, res) => {
    try {
        const { examId, title, description, durationMinutes, passingScore, questions, randomizeQuestions, randomizeAnswers, certificateConfig } = req.body;

        if (examId) {
            // Update existing
            const exam = await CertificationExam.findById(examId);
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
            if (certificateConfig) exam.certificateConfig = certificateConfig;

            const updatedExam = await exam.save();
            return res.json(updatedExam);
        }

        // Create new
        const newExam = new CertificationExam({
            title,
            description,
            durationMinutes,
            passingScore,
            questions,
            randomizeQuestions,
            randomizeAnswers,
            certificateConfig,
        });

        const savedExam = await newExam.save();
        res.status(201).json(savedExam);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get All Certification Exams (Admin)
// @route   GET /api/certification-exams/admin/all
// @access  Private (Admin)
const getCertificationExams = async (req, res) => {
    try {
        const exams = await CertificationExam.find().sort("-createdAt");
        res.json(exams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get All Active Certification Exams (External Student)
// @route   GET /api/certification-exams/external/all
// @access  Private (External Student)
const getAllExamsForExternal = async (req, res) => {
    try {
        const exams = await CertificationExam.find({ isActive: true })
            .select("-questions.correctOptionIndex -questions.correctOptionIndexes -questions.correctAnswer");
        res.json(exams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get Single Certification Exam
// @route   GET /api/certification-exams/:examId
// @access  Private (External Student)
const getCertificationExamById = async (req, res) => {
    try {
        console.log('🔍 Fetching certification exam:', req.params.examId);
        const exam = await CertificationExam.findById(req.params.examId).select("-questions.correctOptionIndex -questions.correctOptionIndexes -questions.correctAnswer");
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        // Check if external student has already attempted this certification exam
        if (req.externalStudent) {
            console.log('👤 External student ID:', req.externalStudent.id);
            const existingResult = await CertificationResult.findOne({
                externalStudentId: req.externalStudent.id,
                examId: req.params.examId
            });

            console.log('📊 Existing result found?', !!existingResult);
            if (existingResult) {
                console.log('⚠️ Blocking access - exam already attempted');
                return res.status(400).json({
                    message: "You have already attempted this exam",
                    alreadyAttempted: true
                });
            }
        }

        res.json(exam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get Single Certification Exam (Admin - Full Data)
// @route   GET /api/certification-exams/admin/:examId
// @access  Private (Admin)
const getCertificationExamForAdmin = async (req, res) => {
    try {
        const exam = await CertificationExam.findById(req.params.examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.json(exam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Submit Certification Exam
// @route   POST /api/certification-exams/submit
// @access  Private (External Student)
const submitCertificationExam = async (req, res) => {
    try {
        console.log('📝 Certification exam submission started');
        const { examId, answers } = req.body;
        console.log('Exam ID:', examId, 'Answers count:', answers?.length);

        if (!req.externalStudent) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const externalStudentId = req.externalStudent.id;

        const exam = await CertificationExam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        // Check if student has already attempted this certification exam
        console.log('🔍 Checking for existing certification result...');
        const existingResult = await CertificationResult.findOne({
            externalStudentId,
            examId
        });

        if (existingResult) {
            console.log('⚠️ Certification exam already attempted');
            return res.status(400).json({
                message: "You have already attempted this exam",
                alreadyAttempted: true
            });
        }
        console.log('✅ No existing result found, proceeding with submission');

        let correctCount = 0;
        const processedAnswers = [];

        answers.forEach(ans => {
            const question = exam.questions.id(ans.questionId);
            if (question) {
                let isCorrect = false;

                switch (question.questionType) {
                    case 'single-choice':
                    case 'true-false':
                        isCorrect = question.correctOptionIndex === ans.selectedOptionIndex;
                        break;
                    case 'multiple-choice':
                        if (Array.isArray(ans.selectedOptionIndexes) && Array.isArray(question.correctOptionIndexes)) {
                            const sorted1 = [...ans.selectedOptionIndexes].map(v => Number(v)).sort((a, b) => a - b);
                            const sorted2 = [...question.correctOptionIndexes].map(v => Number(v)).sort((a, b) => a - b);
                            isCorrect = JSON.stringify(sorted1) === JSON.stringify(sorted2);
                        }
                        break;
                    case 'fill-blank':
                    case 'code':
                        if (ans.textAnswer && question.correctAnswer) {
                            // Simplified check
                            isCorrect = ans.textAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
                        }
                        break;
                    default:
                        isCorrect = Number(ans.selectedOptionIndex) === Number(question.correctOptionIndex);
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

        const result = await CertificationResult.create({
            externalStudentId,
            examId,
            totalQuestions,
            correctAnswers: correctCount,
            scorePercentage,
            isPassed,
            answers: processedAnswers
        });
        console.log('✅ Certification exam submitted successfully. Score:', scorePercentage.toFixed(2) + '%');

        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get My Results
// @route   GET /api/certification-exams/my-results
// @access  Private (External)
const getMyCertificationResults = async (req, res) => {
    try {
        if (!req.externalStudent) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const results = await CertificationResult.find({ externalStudentId: req.externalStudent.id })
            .populate("examId", "title")
            .sort("-createdAt");

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete Exam
// @route   DELETE /api/certification-exams/:id
// @access  Private (Admin)
const deleteCertificationExam = async (req, res) => {
    try {
        await CertificationExam.findByIdAndDelete(req.params.id);
        res.json({ message: "Exam deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update Certification Exam
// @route   PUT /api/certification-exams/:id
// @access  Private (Admin)
const updateCertificationExam = async (req, res) => {
    try {
        const { title, description, durationMinutes, passingScore, questions, randomizeQuestions, randomizeAnswers, certificateConfig } = req.body;

        const exam = await CertificationExam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        // Update only provided fields
        if (title !== undefined) exam.title = title;
        if (description !== undefined) exam.description = description;
        if (durationMinutes !== undefined) exam.durationMinutes = durationMinutes;
        if (passingScore !== undefined) exam.passingScore = passingScore;
        if (questions !== undefined) exam.questions = questions;
        if (randomizeQuestions !== undefined) exam.randomizeQuestions = randomizeQuestions;
        if (randomizeAnswers !== undefined) exam.randomizeAnswers = randomizeAnswers;
        if (certificateConfig !== undefined) {
            // Merge certificate config instead of replacing
            exam.certificateConfig = {
                ...exam.certificateConfig,
                ...certificateConfig
            };
        }

        const updatedExam = await exam.save();
        res.json(updatedExam);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};


// @desc    Generate Certificate for Passed Exam
// @route   GET /api/certification-exams/certificate/:resultId
// @access  Private (External Student)
const generateCertificate = async (req, res) => {
    try {
        // Get token from query parameter (for new tab opening) or from header
        const token = req.query.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify token manually
        const jwt = require('jsonwebtoken');
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Check if it's an external student token
        // We removed the strict check for decoded.isExternal to allow existing tokens to work
        // The middleware and subsequent checks verify the user identity against the database

        const result = await CertificationResult.findById(req.params.resultId)
            .populate("examId", "title passingScore description certificateConfig")
            .populate("externalStudentId", "name email");

        if (!result) {
            return res.status(404).json({ message: "Result not found" });
        }

        // Verify the result belongs to the requesting student
        if (String(result.externalStudentId._id) !== String(decoded.id)) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Check if student passed
        if (!result.isPassed) {
            return res.status(400).json({ message: "Certificate only available for passed exams" });
        }

        // IMPORTANT: Fetch the LATEST exam data to get current certificateConfig
        // This ensures we use the most recent settings, not the cached ones from when exam was taken
        const latestExam = await CertificationExam.findById(result.examId._id);
        if (!latestExam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        // Generate PDF Certificate
        const PDFDocument = require('pdfkit');
        const fs = require('fs');
        const path = require('path');

        // A4 size in points: 595.28 x 841.89 (Portrait)
        // Landscape: 841.89 x 595.28
        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            margins: { top: 0, bottom: 0, left: 0, right: 0 }, // No margins, we handle manually for full bleed
            info: {
                Title: `Certificate - ${result.externalStudentId.name}`,
                Author: 'IITM Computer Education',
                Subject: 'Certificate of Achievement',
                Keywords: 'certificate, education, iitm'
            }
        });

        // Set response headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=certificate-${result._id}.pdf`);

        // Pipe the PDF to the response
        doc.pipe(res);

        // --- DESIGN CONFIGURATION ---
        const pageWidth = 841.89;
        const pageHeight = 595.28;
        // Use the LATEST config from the freshly fetched exam, not the cached one from populate
        const config = latestExam.certificateConfig || {};
        const axios = require('axios');

        // ✨ ELEGANT THEME COLORS - Professional & Clean
        const colors = {
            primary: '#D6A419',      // Golden yellow (theme color)
            secondary: '#1F2937',    // Dark grey (theme dark)
            accent: '#F59E0B',       // Warm amber
            darkText: '#111827',     // Almost black
            lightText: '#6B7280',    // Medium grey
            background: '#f9f9f9',   // Pure white
            border: '#E5E7EB'        // Light border
        };

        // === 1. BACKGROUND ===
        // Clean white background
        doc.rect(0, 0, pageWidth, pageHeight).fill(colors.background);

        // === 1.5. WATERMARK (if background image is provided) ===
        if (config.backgroundImageUrl) {
            try {
                const response = await axios.get(config.backgroundImageUrl, { responseType: 'arraybuffer' });
                // Add as subtle centered watermark with reduced opacity
                doc.save();
                doc.opacity(0.03); // Extremely subtle - 3% opacity
                // Center the watermark
                const watermarkSize = 300; // Fixed size for watermark
                const watermarkX = (pageWidth - watermarkSize) / 2;
                const watermarkY = (pageHeight - watermarkSize) / 2;
                doc.image(response.data, watermarkX, watermarkY, {
                    width: watermarkSize,
                    height: watermarkSize,
                    fit: [watermarkSize, watermarkSize]
                });
                doc.restore(); // Restore full opacity for other elements
            } catch (err) {
                console.error("Watermark image error:", err.message);
            }
        }

        // === 2. DECORATIVE BORDER FRAME ===
        // Outer golden border
        doc.rect(30, 30, pageWidth - 60, pageHeight - 60)
            .lineWidth(3)
            .strokeColor(colors.primary)
            .stroke();

        // Inner dark border
        doc.rect(40, 40, pageWidth - 80, pageHeight - 80)
            .lineWidth(1)
            .strokeColor(colors.secondary)
            .stroke();

        // Corner decorative elements (golden squares)
        const cornerSize = 15;
        const offset = 35;
        // Top-left
        doc.rect(offset, offset, cornerSize, cornerSize).fill(colors.primary);
        // Top-right
        doc.rect(pageWidth - offset - cornerSize, offset, cornerSize, cornerSize).fill(colors.primary);
        // Bottom-left
        doc.rect(offset, pageHeight - offset - cornerSize, cornerSize, cornerSize).fill(colors.primary);
        // Bottom-right
        doc.rect(pageWidth - offset - cornerSize, pageHeight - offset - cornerSize, cornerSize, cornerSize).fill(colors.primary);

        // === 3. LOGO (Top Right) ===
        if (config.showLogo !== false) {
            // Use uploaded logo from database if available, otherwise use default
            if (config.logoImageUrl) {
                try {
                    const logoResponse = await axios.get(config.logoImageUrl, { responseType: 'arraybuffer' });
                    doc.image(logoResponse.data, pageWidth - 160, 55, { height: 80, fit: [120, 80] });
                } catch (logoErr) {
                    console.error("Uploaded logo loading error:", logoErr.message);
                    // Fall back to default logo
                    const logoPath = path.join(__dirname, '../../client/public/logo.png');
                    if (fs.existsSync(logoPath)) {
                        try {
                            doc.image(logoPath, pageWidth - 160, 55, { height: 80 });
                        } catch (imgErr) {
                            console.error("Default logo loading error:", imgErr);
                        }
                    }
                }
            } else {
                // Use default logo
                const logoPath = path.join(__dirname, '../../client/public/logo.png');
                if (fs.existsSync(logoPath)) {
                    try {
                        doc.image(logoPath, pageWidth - 160, 55, { height: 80 });
                    } catch (imgErr) {
                        console.error("Logo loading error:", imgErr);
                    }
                }
            }
        }

        // === 4. HEADER - "CERTIFICATE OF ACHIEVEMENT" ===
        doc.fontSize(16)
            .font('Helvetica')
            .fillColor(colors.lightText)
            .text('CERTIFICATE OF', 0, 80, { align: 'center', width: pageWidth });

        doc.fontSize(20)
            .font('Helvetica-Bold')
            .fillColor(colors.primary)
            .text('ACHIEVEMENT', 0, 102, { align: 'center', width: pageWidth });

        // Decorative line under header
        doc.moveTo(pageWidth / 2 - 100, 135)
            .lineTo(pageWidth / 2 + 100, 135)
            .lineWidth(2)
            .strokeColor(colors.primary)
            .stroke();

        // === 5. EXAM TITLE (Main Focus) ===
        const examTitle = (config.titleOverride || latestExam.title).toUpperCase();
        doc.fontSize(42)
            .font('Helvetica-Bold')
            .fillColor(colors.secondary)
            .text(examTitle, 80, 160, {
                width: pageWidth - 160,
                align: 'center',
                lineGap: 5
            });

        // === 6. "THIS CERTIFIES THAT" ===
        const afterTitleY = doc.y + 25;
        doc.fontSize(12)
            .font('Helvetica')
            .fillColor(colors.lightText)
            .text('This certifies that', 0, afterTitleY, { align: 'center', width: pageWidth });

        // === 7. STUDENT NAME (Highlighted) ===
        const nameY = afterTitleY + 30;
        doc.fontSize(38)
            .font('Helvetica-Bold')
            .fillColor(colors.darkText)
            .text(result.externalStudentId.name, 0, nameY, { align: 'center', width: pageWidth });

        // Elegant underline for name
        const nameWidth = doc.widthOfString(result.externalStudentId.name);
        const nameUnderlineY = nameY + 50;
        doc.moveTo(pageWidth / 2 - nameWidth / 2, nameUnderlineY)
            .lineTo(pageWidth / 2 + nameWidth / 2, nameUnderlineY)
            .lineWidth(2)
            .strokeColor(colors.primary)
            .stroke();

        // === 8. DESCRIPTION ===
        const descText = config.descriptionOverride || latestExam.description ||
            `has successfully completed the ${latestExam.title} examination and demonstrated exceptional proficiency in the assessed technical skills and knowledge areas.`;

        doc.fontSize(13)
            .font('Helvetica')
            .fillColor(colors.lightText)
            .text(descText, 100, nameUnderlineY + 25, {
                width: pageWidth - 200,
                align: 'center',
                lineGap: 6
            });

        // === 9. FOOTER SECTION ===
        const footerY = pageHeight - 140;

        // Left side - Date & Certificate ID
        if (config.showDate !== false) {
            doc.fontSize(11)
                .font('Helvetica-Bold')
                .fillColor(colors.darkText)
                .text('Issue Date', 80, footerY);

            doc.fontSize(10)
                .font('Helvetica')
                .fillColor(colors.lightText)
                .text(new Date(result.createdAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                }), 80, footerY + 18);
        }

        if (config.showId !== false) {
            const certIdY = config.showDate !== false ? footerY + 45 : footerY;
            doc.fontSize(11)
                .font('Helvetica-Bold')
                .fillColor(colors.darkText)
                .text('Certificate ID', 80, certIdY);

            doc.fontSize(10)
                .font('Helvetica')
                .fillColor(colors.lightText)
                .text(result._id.toString().slice(-12).toUpperCase(), 80, certIdY + 18);
        }

        // Right side - Signature
        const signatureX = pageWidth - 280;
        const signatureLineY = footerY + 50; // Position of the signature line

        // Signature image (ABOVE the line)
        if (config.signatureImageUrl) {
            try {
                const sigResponse = await axios.get(config.signatureImageUrl, { responseType: 'arraybuffer' });
                // Draw image ABOVE the line - positioned to sit naturally just above the signature line
                doc.image(sigResponse.data, signatureX, signatureLineY - 45, {
                    height: 40,
                    width: 150,
                    fit: [150, 40],
                    align: 'center'
                });
            } catch (sigErr) {
                console.error("Signature image error:", sigErr.message);
            }
        }

        // Always draw the signature line
        doc.moveTo(signatureX, signatureLineY)
            .lineTo(signatureX + 150, signatureLineY)
            .lineWidth(1)
            .strokeColor(colors.darkText)
            .stroke();

        // Signature name (BELOW the line)
        const sigNameY = signatureLineY + 8;
        if (config.signatureName) {
            doc.fontSize(11)
                .font('Helvetica-Bold')
                .fillColor(colors.darkText)
                .text(config.signatureName, signatureX, sigNameY, { width: 150, align: 'center' });
        }

        // Signature title (BELOW the name)
        const sigTitleY = sigNameY + 16;
        if (config.signatureTitle) {
            doc.fontSize(9)
                .font('Helvetica')
                .fillColor(colors.lightText)
                .text(config.signatureTitle, signatureX, sigTitleY, { width: 150, align: 'center' });
        } else {
            doc.fontSize(9)
                .font('Helvetica')
                .fillColor(colors.lightText)
                .text('Authorized Signatory', signatureX, sigTitleY, { width: 150, align: 'center' });
        }

        // === 10. BOTTOM ACCENT BAR ===
        doc.rect(0, pageHeight - 20, pageWidth, 20)
            .fill(colors.primary);

        // Finalize PDF
        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    createCertificationExam,
    getCertificationExams,
    getAllExamsForExternal,
    getCertificationExamById,
    submitCertificationExam,
    getMyCertificationResults,
    deleteCertificationExam,
    updateCertificationExam,
    getCertificationExamForAdmin,
    generateCertificate
};
