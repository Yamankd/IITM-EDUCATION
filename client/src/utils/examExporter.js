import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";

/* --- 1. CSV Export --- */
export const exportExamCSV = (exam) => {
    if (!exam.questions || exam.questions.length === 0) {
        alert("No questions to export.");
        return;
    }

    const csvData = exam.questions.map((q) => {
        const row = {
            "Question Text": q.questionText,
            "Question Type": q.questionType,
            Marks: q.marks,
            "Correct Answer": q.correctAnswer || "",
            "Multiple Choice Indices": (q.correctOptionIndexes || []).join("|"),
            "Single Correct Index": q.correctOptionIndex,
        };

        q.options.forEach((opt, i) => {
            row[`Option ${i + 1}`] = opt.text;
        });

        return row;
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exam.title || "exam"}_questions.csv`;
    link.click();
};

/* --- 2. JSON Export --- */
export const exportExamJSON = (exam) => {
    const dataStr = JSON.stringify(exam.questions, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exam.title || "exam"}_questions.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/* --- 3. PDF Question Paper Export --- */
export const exportExamPDF = (exam, includeAnswers = false) => {
    if (!exam.questions || exam.questions.length === 0) {
        alert("No questions to generate PDF.");
        return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(11, 42, 74);
    doc.text(exam.title || "Untitled Exam", pageWidth / 2, 20, { align: "center" });

    if (includeAnswers) {
        doc.setFontSize(14);
        doc.setTextColor(200, 0, 0);
        doc.text("(ANSWER KEY)", pageWidth / 2, 28, { align: "center" });
    }

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(
        `Duration: ${exam.durationMinutes} mins   |   Total Questions: ${exam.questions.length}`,
        pageWidth / 2,
        35,
        { align: "center" }
    );

    doc.setDrawColor(200);
    doc.line(10, 40, pageWidth - 10, 40);

    // Questions
    let yPos = 50;
    exam.questions.forEach((q, index) => {
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");

        const qTitle = `${index + 1}. ${q.questionText} (${q.marks} marks)`;
        const userTitle = doc.splitTextToSize(qTitle, pageWidth - 20);
        doc.text(userTitle, 10, yPos);
        yPos += userTitle.length * 7;

        // Options
        if (q.questionType === "single-choice" || q.questionType === "multiple-choice") {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            q.options.forEach((opt, i) => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }

                let prefix = `(${String.fromCharCode(65 + i)})`; // A, B, C...
                let text = `   ${prefix} ${opt.text}`;

                // Highlight correct answer if Answer Key
                if (includeAnswers) {
                    const isCorrect = q.questionType === 'multiple-choice'
                        ? (q.correctOptionIndexes || []).some(idx => Number(idx) === i)
                        : Number(q.correctOptionIndex) === i;

                    if (isCorrect) {
                        doc.setTextColor(0, 150, 0);
                        doc.setFont("helvetica", "bold");
                        text += "  [CORRECT]";
                    } else {
                        doc.setTextColor(0);
                        doc.setFont("helvetica", "normal");
                    }
                }

                doc.text(text, 15, yPos);
                yPos += 7;
            });
            doc.setTextColor(0); // Reset
        } else if (q.questionType === "true-false") {
            if (includeAnswers) {
                const isTrue = Number(q.correctOptionIndex) === 0; // 0 is True, 1 is False
                doc.setTextColor(isTrue ? 0 : 100);
                if (isTrue) doc.setFont("helvetica", "bold");
                doc.text("   (A) True " + (isTrue ? "[CORRECT]" : ""), 15, yPos);
                yPos += 7;

                doc.setTextColor(!isTrue ? 0 : 100);
                if (!isTrue) doc.setFont("helvetica", "bold");
                doc.text("   (B) False " + (!isTrue ? "[CORRECT]" : ""), 15, yPos);
                yPos += 7;
                doc.setTextColor(0);
            } else {
                doc.text("   (A) True", 15, yPos);
                yPos += 7;
                doc.text("   (B) False", 15, yPos);
                yPos += 7;
            }
        } else {
            if (includeAnswers) {
                doc.setTextColor(0, 100, 0);
                doc.text(`   Answer: ${q.correctAnswer}`, 15, yPos);
                doc.setTextColor(0);
                yPos += 7;
            } else {
                yPos += 20; // Space for answer
            }
        }

        yPos += 8;
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text('Page ' + i + ' of ' + pageCount, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }

    doc.save(`${exam.title || "exam"}${includeAnswers ? "_ANSWER_KEY" : "_paper"}.pdf`);
};
