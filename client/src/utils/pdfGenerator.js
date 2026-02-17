import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateExamPDF = (exam, result, studentProfile) => {
    const doc = new jsPDF();

    // Helper to add centered text
    const centerText = (text, y, size = 12, style = "normal") => {
        doc.setFontSize(size);
        doc.setFont("helvetica", style);
        const textWidth =
            (doc.getStringUnitWidth(text) * size) / doc.internal.scaleFactor;
        const x = (doc.internal.pageSize.width - textWidth) / 2;
        doc.text(text, x, y);
    };

    // Title
    centerText("Exam Result Report", 20, 18, "bold");
    centerText(exam.title, 28, 14);

    // Student Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Student: ${studentProfile?.name || "Student"}`, 14, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 46);

    // Score Summary
    doc.setDrawColor(200);
    doc.setFillColor(245, 247, 250);
    doc.rect(14, 52, 182, 24, "FD");

    doc.text(`Score: ${result.scorePercentage.toFixed(1)}%`, 20, 62);
    doc.text(
        `Correct: ${result.correctAnswers} / ${result.totalQuestions}`,
        20,
        68,
    );

    doc.setFont("helvetica", "bold");
    if (result.isPassed) {
        doc.setTextColor(22, 163, 74); // Green
        doc.text("STATUS: PASSED", 140, 65);
    } else {
        doc.setTextColor(220, 38, 38); // Red
        doc.text("STATUS: FAILED", 140, 65);
    }
    doc.setTextColor(0); // Reset color

    // Questions Table
    const tableData = result.answers.map((ans, index) => {
        // Find question text from exam object (if available)
        const question = exam.questions.find((q) => q._id === ans.questionId);
        const isCorrect = ans.isCorrect;

        let studentAnswer = "Not Answered";

        // Determine what to show as the answer
        if (ans.selectedOptionIndex !== undefined) {
            // Single Choice
            if (question?.options) {
                studentAnswer = question.options[ans.selectedOptionIndex]?.text || `Option ${ans.selectedOptionIndex + 1}`;
            } else {
                studentAnswer = `Option ${ans.selectedOptionIndex + 1}`;
            }
        } else if (ans.selectedOptionIndexes && Array.isArray(ans.selectedOptionIndexes)) {
            // Multiple Choice
            if (question?.options) {
                studentAnswer = ans.selectedOptionIndexes
                    .map(i => question.options[i]?.text)
                    .join(", ");
            } else {
                studentAnswer = ans.selectedOptionIndexes.map(i => `Option ${i + 1}`).join(", ");
            }
        } else if (ans.textAnswer) {
            // Text / Code
            studentAnswer = ans.textAnswer;
        }

        return [
            index + 1,
            question?.questionText || `Question ${index + 1}`,
            studentAnswer,
            isCorrect ? "Correct" : "Incorrect",
        ];
    });

    autoTable(doc, {
        startY: 85,
        head: [["#", "Question", "Your Answer", "Status"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [11, 42, 74] }, // #0B2A4A
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 80 },
            2: { cellWidth: 70 },
            3: { cellWidth: 20 },
        },
        didParseCell: (data) => {
            if (data.section === "body" && data.column.index === 3) {
                const status = data.cell.raw;
                if (status === "Correct") {
                    data.cell.styles.textColor = [22, 163, 74];
                } else {
                    data.cell.styles.textColor = [220, 38, 38];
                }
            }
        },
    });

    doc.save(`${exam.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_result.pdf`);
};

export const generateCertificatePDF = (data, action = "download") => {
    const doc = new jsPDF("l", "mm", "a4"); // Landscape
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // --- Decorative Border ---
    doc.setDrawColor(11, 42, 74); // #0B2A4A
    doc.setLineWidth(3);
    doc.rect(10, 10, width - 20, height - 20); // Outer

    doc.setDrawColor(214, 164, 25); // #D6A419
    doc.setLineWidth(1);
    doc.rect(15, 15, width - 30, height - 30); // Inner

    // --- Helper for Centered Text ---
    const centerText = (text, y, size = 12, font = "helvetica", style = "normal", color = [0, 0, 0]) => {
        doc.setFontSize(size);
        doc.setFont(font, style);
        doc.setTextColor(...color);
        const textWidth = (doc.getStringUnitWidth(text) * size) / doc.internal.scaleFactor;
        const x = (width - textWidth) / 2;
        doc.text(text, x, y);
    };

    // --- Header ---
    centerText("CERTIFICATE", 60, 50, "times", "bold", [11, 42, 74]); // Dark Blue
    centerText("OF ACHIEVEMENT", 75, 20, "times", "normal", [214, 164, 25]); // Gold

    // --- Body ---
    centerText("This is to certify that", 100, 16, "helvetica", "italic", [100, 100, 100]);

    // Name (Underlined)
    const name = data.visitorName || "Student Name";
    centerText(name, 125, 40, "times", "bold", [11, 42, 74]);
    doc.setDrawColor(214, 164, 25);
    doc.setLineWidth(0.5);
    doc.line(width / 2 - 60, 128, width / 2 + 60, 128); // Underline

    centerText("has successfully completed the quiz for", 145, 16, "helvetica", "italic", [100, 100, 100]);

    // Quiz Title
    centerText(data.quizId?.title || "Free Certification Quiz", 160, 24, "helvetica", "bold", [0, 0, 0]);

    // --- Footer ---
    const date = new Date(data.createdAt).toLocaleDateString();
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);

    // Date
    doc.text(date, 50, 180);
    doc.line(40, 182, 90, 182); // Line
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Date", 60, 188);

    // Signature
    doc.setFontSize(16);
    doc.setFont("times", "italic");
    doc.setTextColor(11, 42, 74);
    doc.text("Digital IITM", width - 80, 180);
    doc.setDrawColor(0, 0, 0);
    doc.line(width - 90, 182, width - 40, 182);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text("Director Signature", width - 78, 188);

    // ID
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text(`Certificate ID: ${data.certificateId}`, width - 60, height - 5);

    // --- Output Action ---
    if (action === "preview") {
        const pdfUrl = doc.output("bloburl");
        window.open(pdfUrl, "_blank");
    } else {
        doc.save(`Certificate-${data.certificateId}.pdf`);
    }
};
