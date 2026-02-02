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
