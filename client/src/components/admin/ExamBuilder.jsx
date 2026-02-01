import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  Clock,
  Award,
  Copy,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  ArrowLeft,
  Shuffle,
  Info,
  Download,
  Upload,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import api from "../../api/api";
import { useAlert } from "../../context/AlertContext";
import { useConfirm } from "../../components/ConfirmDialog";
import AIGeneratorModal from "./modals/AIGeneratorModal";
import Papa from "papaparse";

const ExamBuilder = ({ courseId, examId, onSave, onCancel }) => {
  const { showError, showSuccess } = useAlert();
  const { showConfirm } = useConfirm();
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    durationMinutes: 60,
    passingScore: 40,
    randomizeQuestions: false,
    randomizeAnswers: false,
    questions: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const fileInputRef = React.useRef(null);
  const csvInputRef = React.useRef(null);

  useEffect(() => {
    if (examId && examId !== "new") {
      fetchExam();
    } else {
      // Reset for new exam
      setExamData((prev) => ({
        ...prev,
        title: "",
        description: "",
        durationMinutes: 60,
        passingScore: 40,
        randomizeQuestions: false,
        randomizeAnswers: false,
        questions: [],
      }));
    }
  }, [examId]);

  const fetchExam = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/exams/admin/${examId}`);
      setExamData(data);
    } catch (error) {
      console.log("Failed to fetch exam:", error);
      showError("Failed to load exam data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExamData({
      ...examData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* --- CSV & PDF Handlers --- */

  // 2. Import from CSV using PapaParse
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error("CSV Errors:", results.errors);
          showError("Failed to parse CSV file. Check console for details.");
          return;
        }

        try {
          const importedQuestions = results.data.map((row) => {
            // Reconstruct options
            const options = [];
            Object.keys(row).forEach((key) => {
              if (key.startsWith("Option") && row[key]) {
                options.push({ text: row[key] });
              }
            });

            // Basic Quick Reconstruction logic
            return {
              questionText: row["Question Text"] || "Imported Question",
              questionType: row["Question Type"] || "single-choice",
              marks: parseInt(row["Marks"]) || 1,
              correctAnswer: row["Correct Answer"],
              correctOptionIndex: parseInt(row["Single Correct Index"]) || 0,
              correctOptionIndexes: row["Multiple Choice Indices"]
                ? row["Multiple Choice Indices"]
                    .split("|")
                    .map((i) => parseInt(i))
                : [],
              options:
                options.length > 0
                  ? options
                  : [{ text: "Yes" }, { text: "No" }],
              caseSensitive: false,
            };
          });

          setExamData((prev) => ({
            ...prev,
            questions: [...prev.questions, ...importedQuestions],
          }));
          showSuccess(
            `Imported ${importedQuestions.length} questions from CSV!`,
          );
        } catch (err) {
          console.error(err);
          showError("Error converting CSV data to questions.");
        }
      },
    });
    e.target.value = null; // Reset input
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedQuestions = JSON.parse(event.target.result);
        if (Array.isArray(importedQuestions)) {
          setExamData((prev) => ({
            ...prev,
            questions: [...prev.questions, ...importedQuestions],
          }));
          showSuccess(`Imported ${importedQuestions.length} questions!`);
        } else {
          showError("Invalid JSON format: Expected an array of questions.");
        }
      } catch (error) {
        showError("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = null; // Reset input
  };

  const handleAIGenerated = (newQuestions) => {
    setExamData((prev) => ({
      ...prev,
      questions: [...prev.questions, ...newQuestions],
    }));
    setShowAIModal(false);
  };

  const addQuestion = () => {
    const newQuestion = {
      questionText: "",
      questionType: "single-choice",
      options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
      correctOptionIndex: 0,
      correctOptionIndexes: [],
      correctAnswer: "",
      marks: 1,
      imageUrl: "",
      codeLanguage: "javascript",
      caseSensitive: false,
    };
    setExamData({
      ...examData,
      questions: [...examData.questions, newQuestion],
    });
    setCurrentQuestionIndex(examData.questions.length);
  };

  const duplicateQuestion = (index) => {
    const questionToDuplicate = { ...examData.questions[index] };
    const newQuestions = [...examData.questions];
    newQuestions.splice(index + 1, 0, questionToDuplicate);
    setExamData({ ...examData, questions: newQuestions });
    setCurrentQuestionIndex(index + 1);
  };

  const removeQuestion = async (index) => {
    const isConfirmed = await showConfirm({
      title: "Delete Question",
      message: "Are you sure you want to delete this question?",
      type: "danger",
      confirmText: "Delete",
    });

    if (isConfirmed) {
      const newQuestions = [...examData.questions];
      newQuestions.splice(index, 1);
      setExamData({ ...examData, questions: newQuestions });
      if (currentQuestionIndex >= newQuestions.length) {
        setCurrentQuestionIndex(Math.max(0, newQuestions.length - 1));
      }
    }
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...examData.questions];
    newQuestions[index][field] = value;
    setExamData({ ...examData, questions: newQuestions });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...examData.questions];
    newQuestions[qIndex].options[oIndex].text = value;
    setExamData({ ...examData, questions: newQuestions });
  };

  const addOption = (qIndex) => {
    const newQuestions = [...examData.questions];
    newQuestions[qIndex].options.push({ text: "" });
    setExamData({ ...examData, questions: newQuestions });
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...examData.questions];
    if (newQuestions[qIndex].options.length > 2) {
      newQuestions[qIndex].options.splice(oIndex, 1);
      // Adjust correct answer index if needed
      if (newQuestions[qIndex].correctOptionIndex >= oIndex) {
        newQuestions[qIndex].correctOptionIndex = Math.max(
          0,
          newQuestions[qIndex].correctOptionIndex - 1,
        );
      }
      setExamData({ ...examData, questions: newQuestions });
    }
  };

  const isQuestionComplete = (question) => {
    if (!question.questionText.trim()) return false;

    // Check specific types logic
    if (
      question.questionType === "single-choice" ||
      question.questionType === "multiple-choice" ||
      !question.questionType
    ) {
      if (question.options.some((opt) => !opt.text.trim())) return false;
    }

    if (
      question.questionType === "fill-blank" ||
      question.questionType === "code"
    ) {
      if (!question.correctAnswer || !question.correctAnswer.trim())
        return false;
    }

    return true;
  };

  const getCompletionStats = () => {
    const complete = examData.questions.filter(isQuestionComplete).length;
    const total = examData.questions.length;
    return { complete, total };
  };

  const handleSave = async () => {
    // Validation
    if (!examData.title.trim()) {
      showError("Please enter an exam title");
      return;
    }
    if (examData.questions.length === 0) {
      showError("Please add at least one question");
      return;
    }
    const incomplete = examData.questions.filter((q) => !isQuestionComplete(q));
    if (incomplete.length > 0) {
      const isConfirmed = await showConfirm({
        title: "Incomplete Questions",
        message: `${incomplete.length} question(s) are incomplete. Save anyway?`,
        type: "warning",
        confirmText: "Save",
      });
      if (!isConfirmed) return;
    }

    setSaving(true);
    try {
      await api.post("/exams", {
        courseId,
        examId: examId === "new" ? null : examId,
        ...examData,
      });
      showSuccess("Exam saved successfully!");
      if (onSave) onSave();
    } catch (error) {
      console.error(error);
      showError("Failed to save exam.");
    } finally {
      setSaving(false);
    }
  };

  const stats = getCompletionStats();

  if (!courseId && !examId)
    // Fallback check
    return (
      <div className="text-center p-10 text-gray-500">
        Please select a course first.
      </div>
    );

  return (
    // FULL SCREEN OVERLAY
    <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex flex-col font-sans">
      {/* 1. Editor Header / Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 flex items-center justify-between z-20 shadow-md relative">
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500"
              title="Exit Exam Builder"
            >
              <ArrowLeft size={20} className="md:w-6 md:h-6" />
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
            title="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <input
              name="title"
              value={examData.title}
              onChange={handleInputChange}
              className="w-full text-lg md:text-2xl font-bold bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-[#D6A419] outline-none transition-colors text-[#0B2A4A] dark:text-white placeholder-gray-300 dark:placeholder-gray-600 pb-1"
              placeholder="Untitled Exam Name"
            />
            <div className="hidden md:flex items-center gap-4 mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {examData.durationMinutes} mins
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="flex items-center gap-1">
                <Award size={14} />
                Pass: {examData.passingScore}%
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span>
                {stats.complete} of {stats.total} Questions Ready
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 gap-1">
            <button
              onClick={() => csvInputRef.current.click()}
              className="p-2 text-gray-500 dark:text-gray-300 hover:text-[#0B2A4A] dark:hover:text-white hover:bg-white dark:hover:bg-gray-600 rounded-md transition-all flex items-center gap-1"
              title="Import CSV"
            >
              <Upload size={16} />
              <span className="font-bold text-xs">Import CSV</span>
            </button>
            <div className="w-px bg-gray-300 dark:bg-gray-600 my-1"></div>
            <button
              onClick={() => fileInputRef.current.click()}
              className="p-2 text-gray-500 dark:text-gray-300 hover:text-[#0B2A4A] dark:hover:text-white hover:bg-white dark:hover:bg-gray-600 rounded-md transition-all flex items-center gap-1"
              title="Import JSON"
            >
              <Upload size={16} />
              <span className="font-bold text-xs">Import JSON</span>
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json"
            className="hidden"
          />
          <input
            type="file"
            ref={csvInputRef}
            onChange={handleImportCSV}
            accept=".csv"
            className="hidden"
          />

          <div className="hidden md:block h-8 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-bold bg-[#D6A419] text-[#0B2A4A] rounded-lg shadow-lg hover:shadow-xl hover:bg-[#eebb30] transition-all flex items-center gap-2 disabled:opacity-70 transform active:scale-95"
          >
            {saving ? (
              <Clock size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span className="hidden sm:inline">
              {saving ? "Saving..." : "Save Exam"}
            </span>
            <span className="sm:hidden">{saving ? "..." : "Save"}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* 2. Side Panel (Question Navigator & Settings) */}
        <div
          className={`
          ${sidebarCollapsed ? "w-16" : "w-80"}
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
          flex flex-col flex-shrink-0 z-40 transition-all duration-300 shadow-xl
          fixed md:relative inset-y-0 left-0 top-16 md:top-0
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        >
          {/* Sidebar Toggle Button (Desktop) */}
          <div className="hidden md:flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700">
            {!sidebarCollapsed && (
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Exam Builder
              </h3>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 ml-auto"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Exam Configuration
            </h3>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500"
            >
              <X size={18} />
            </button>
          </div>

          {/* Settings Tab */}
          {!sidebarCollapsed && (
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Info size={14} /> Exam Configuration
              </h3>

              {/* Duration & Passing Score grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">
                    Time (Min)
                  </label>
                  <input
                    type="number"
                    name="durationMinutes"
                    value={examData.durationMinutes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-center focus:border-[#D6A419] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">
                    Pass Sc %
                  </label>
                  <input
                    type="number"
                    name="passingScore"
                    value={examData.passingScore}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-center focus:border-[#D6A419] outline-none"
                  />
                </div>
              </div>

              {/* Randomization Toggles */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Shuffle size={14} className="text-[#D6A419]" />
                    Shuffle Questions
                  </span>
                  <div className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      name="randomizeQuestions"
                      checked={examData.randomizeQuestions}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#0B2A4A]"></div>
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Shuffle size={14} className="text-[#D6A419]" />
                    Shuffle Options
                  </span>
                  <div className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      name="randomizeAnswers"
                      checked={examData.randomizeAnswers}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#0B2A4A]"></div>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">
                  Exam Description
                </label>
                <textarea
                  name="description"
                  value={examData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:border-[#D6A419] outline-none resize-none"
                  placeholder="Enter brief instructions..."
                />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Questions ({examData.questions.length})
                  </h3>
                  <button
                    onClick={addQuestion}
                    className="text-xs font-bold text-[#D6A419] hover:text-[#b88c12] uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>

                {examData.questions.length === 0 ? (
                  <div className="text-center py-10 px-4 text-gray-400 text-sm italic">
                    No questions added yet.
                  </div>
                ) : (
                  examData.questions.map((q, index) => {
                    const isComplete = isQuestionComplete(q);
                    const isSelected = index === currentQuestionIndex;
                    return (
                      <div
                        key={index}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                          isSelected
                            ? "bg-[#0B2A4A] border-[#0B2A4A] text-white shadow-md transform scale-[1.02]"
                            : "bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                            isSelected
                              ? "bg-[#D6A419] text-[#0B2A4A]"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="truncate text-sm font-medium flex-1">
                          {q.questionText || (
                            <span className="italic opacity-50">
                              New Question
                            </span>
                          )}
                        </span>
                        {isComplete ? (
                          <CheckCircle2
                            size={14}
                            className={
                              isSelected ? "text-[#D6A419]" : "text-green-500"
                            }
                          />
                        ) : (
                          <AlertCircle
                            size={14}
                            className={
                              isSelected ? "text-orange-300" : "text-orange-400"
                            }
                          />
                        )}

                        {/* Hover actions */}
                        {!isSelected && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeQuestion(index);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}

                <button
                  onClick={addQuestion}
                  className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-[#D6A419] hover:text-[#D6A419] transition-all flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <Plus size={16} /> Add New Question
                </button>
                <button
                  onClick={() => setShowAIModal(true)}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-[#0B2A4A] to-[#1a4c7a] text-white rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 text-sm font-bold active:translate-y-0 active:scale-95"
                >
                  <Sparkles size={16} className="text-[#D6A419]" /> Generate
                  with AI
                </button>
              </>
            ) : (
              // Collapsed sidebar - icon only buttons
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={addQuestion}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-[#D6A419]"
                  title="Add Question"
                >
                  <Plus size={20} />
                </button>
                <button
                  onClick={() => setShowAIModal(true)}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-[#D6A419]"
                  title="AI Generate"
                >
                  <Sparkles size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Main Editor Canvas */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-4xl mx-auto pb-8">
            {examData.questions.length > 0 ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Question Type & Actions Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#0B2A4A]/5 text-[#0B2A4A] dark:text-blue-300 dark:bg-blue-900/20 rounded-full text-xs font-bold uppercase tracking-wide">
                      Question {currentQuestionIndex + 1}
                    </span>
                    <select
                      value={
                        examData.questions[currentQuestionIndex].questionType ||
                        "single-choice"
                      }
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestionIndex,
                          "questionType",
                          e.target.value,
                        )
                      }
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-transparent border-b border-gray-300 hover:border-[#D6A419] focus:border-[#D6A419] outline-none cursor-pointer py-0.5"
                    >
                      <option value="single-choice">Single Choice</option>
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="true-false">True / False</option>
                      <option value="fill-blank">Fill in the Blank</option>
                      <option value="code">Code Snippet</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => duplicateQuestion(currentQuestionIndex)}
                      className="p-2 text-gray-400 hover:text-[#0B2A4A] dark:hover:text-white transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={18} />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button
                      onClick={() => removeQuestion(currentQuestionIndex)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Card Container */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden">
                  {/* Question Input */}
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <textarea
                      value={
                        examData.questions[currentQuestionIndex].questionText
                      }
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestionIndex,
                          "questionText",
                          e.target.value,
                        )
                      }
                      rows={1}
                      className="w-full text-xl md:text-2xl font-medium text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 bg-transparent outline-none resize-none leading-relaxed"
                      placeholder="Type your question here..."
                    />
                  </div>

                  {/* Answer Area */}
                  <div className="p-5 bg-gray-50/50 dark:bg-gray-800/50">
                    {(() => {
                      const q = examData.questions[currentQuestionIndex];
                      const type = q.questionType || "single-choice";

                      if (
                        type === "single-choice" ||
                        type === "multiple-choice" ||
                        type === "true-false"
                      ) {
                        return (
                          <div className="space-y-3">
                            {q.options.map((opt, oIndex) => {
                              const isCorrect =
                                type === "multiple-choice"
                                  ? (q.correctOptionIndexes || []).includes(
                                      oIndex,
                                    )
                                  : q.correctOptionIndex === oIndex;

                              return (
                                <div
                                  key={oIndex}
                                  className={`group flex items-center gap-4 transition-all duration-200 ${
                                    isCorrect ? "pl-2" : "hover:pl-2"
                                  }`}
                                >
                                  <div className="relative">
                                    <input
                                      type={
                                        type === "multiple-choice"
                                          ? "checkbox"
                                          : "radio"
                                      }
                                      checked={isCorrect}
                                      onChange={() => {
                                        if (type === "multiple-choice") {
                                          const current =
                                            q.correctOptionIndexes || [];
                                          const updated = current.includes(
                                            oIndex,
                                          )
                                            ? current.filter(
                                                (i) => i !== oIndex,
                                              )
                                            : [...current, oIndex];
                                          updateQuestion(
                                            currentQuestionIndex,
                                            "correctOptionIndexes",
                                            updated,
                                          );
                                        } else {
                                          updateQuestion(
                                            currentQuestionIndex,
                                            "correctOptionIndex",
                                            oIndex,
                                          );
                                        }
                                      }}
                                      className="w-5 h-5 cursor-pointer accent-[#D6A419]"
                                    />
                                    {isCorrect && (
                                      <div className="absolute inset-0 bg-[#D6A419] rounded-full opacity-20 animate-ping"></div>
                                    )}
                                  </div>

                                  <div
                                    className={`flex-1 relative rounded-xl border transition-all ${
                                      isCorrect
                                        ? "bg-white dark:bg-gray-700 border-[#D6A419] shadow-md shadow-yellow-500/10 scale-[1.01]"
                                        : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 group-hover:border-gray-300"
                                    }`}
                                  >
                                    <input
                                      value={opt.text}
                                      onChange={(e) =>
                                        updateOption(
                                          currentQuestionIndex,
                                          oIndex,
                                          e.target.value,
                                        )
                                      }
                                      placeholder={`Option ${oIndex + 1}`}
                                      className="w-full px-5 py-3 bg-transparent outline-none rounded-xl text-gray-700 dark:text-gray-200 font-medium"
                                    />

                                    {q.options.length > 2 &&
                                      type !== "true-false" && (
                                        <button
                                          onClick={() =>
                                            removeOption(
                                              currentQuestionIndex,
                                              oIndex,
                                            )
                                          }
                                          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all hover:bg-red-50 rounded-full"
                                        >
                                          <X size={16} />
                                        </button>
                                      )}
                                  </div>
                                </div>
                              );
                            })}

                            {type !== "true-false" && (
                              <button
                                onClick={() => addOption(currentQuestionIndex)}
                                className="ml-9 px-4 py-2 text-sm font-bold text-[#D6A419] bg-[#D6A419]/10 hover:bg-[#D6A419]/20 border border-[#D6A419]/20 rounded-lg transition-colors flex items-center gap-2"
                              >
                                <Plus size={16} />
                                Add Option
                              </button>
                            )}
                          </div>
                        );
                      }

                      if (type === "fill-blank" || type === "code") {
                        return (
                          <div className="space-y-6">
                            {type === "code" && (
                              <div className="flex gap-4">
                                <div className="w-1/3">
                                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                                    Language
                                  </label>
                                  <select
                                    value={q.codeLanguage || "javascript"}
                                    onChange={(e) =>
                                      updateQuestion(
                                        currentQuestionIndex,
                                        "codeLanguage",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-white outline-none focus:border-[#D6A419]"
                                  >
                                    <option value="javascript">
                                      JavaScript
                                    </option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="html">HTML</option>
                                    <option value="css">CSS</option>
                                  </select>
                                </div>
                              </div>
                            )}

                            <div>
                              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                                {type === "code"
                                  ? "Expected Solution Code"
                                  : "Correct Answer"}
                              </label>
                              {type === "code" ? (
                                <textarea
                                  value={q.correctAnswer || ""}
                                  onChange={(e) =>
                                    updateQuestion(
                                      currentQuestionIndex,
                                      "correctAnswer",
                                      e.target.value,
                                    )
                                  }
                                  rows={8}
                                  className="w-full px-5 py-3 bg-[#1e1e1e] text-blue-300 font-mono text-sm rounded-xl border border-gray-700 outline-none focus:border-[#D6A419] shadow-inner"
                                  placeholder="// Write the expected solution code..."
                                />
                              ) : (
                                <input
                                  value={q.correctAnswer || ""}
                                  onChange={(e) =>
                                    updateQuestion(
                                      currentQuestionIndex,
                                      "correctAnswer",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-5 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-lg font-medium text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#D6A419] transition-all"
                                  placeholder="Type the correct answer..."
                                />
                              )}
                            </div>

                            {type === "fill-blank" && (
                              <label className="inline-flex items-center gap-3 cursor-pointer group">
                                <div
                                  className={`w-5 h-5 flex items-center justify-center border-2 rounded transition-colors ${q.caseSensitive ? "bg-[#D6A419] border-[#D6A419]" : "border-gray-300 group-hover:border-gray-400"}`}
                                >
                                  {q.caseSensitive && (
                                    <CheckCircle2
                                      size={14}
                                      className="text-white"
                                    />
                                  )}
                                </div>
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  checked={q.caseSensitive || false}
                                  onChange={(e) =>
                                    updateQuestion(
                                      currentQuestionIndex,
                                      "caseSensitive",
                                      e.target.checked,
                                    )
                                  }
                                />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                  Case Sensitive
                                </span>
                              </label>
                            )}
                          </div>
                        );
                      }
                    })()}
                  </div>

                  {/* Footer Actions */}
                  <div className="bg-gray-50 border-t border-gray-100 px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Marks:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={examData.questions[currentQuestionIndex].marks}
                        onChange={(e) =>
                          updateQuestion(
                            currentQuestionIndex,
                            "marks",
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="w-16 px-2 py-1 bg-white border border-gray-200 rounded text-center font-bold text-[#0B2A4A] outline-none focus:border-[#D6A419]"
                      />
                    </div>

                    {/* Nav Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.max(0, prev - 1),
                          )
                        }
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-[#0B2A4A] hover:bg-white rounded-lg transition-colors disabled:opacity-30"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.min(examData.questions.length - 1, prev + 1),
                          )
                        }
                        disabled={
                          currentQuestionIndex === examData.questions.length - 1
                        }
                        className="px-6 py-2 text-sm font-bold bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0f406e] transition-colors shadow-md disabled:opacity-50 disabled:shadow-none"
                      >
                        Next Question
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center h-full pt-20 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-gradient-to-br from-[#0B2A4A] to-[#1a4c7a] rounded-3xl flex items-center justify-center shadow-xl mb-8 transform rotate-3">
                  <FileText size={48} className="text-[#D6A419]" />
                </div>
                <h2 className="text-3xl font-bold text-[#0B2A4A] dark:text-white mb-3">
                  Time to Build!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md text-center mb-8 leading-relaxed">
                  Create a new exam by adding your first question. You can
                  choose from multiple formats including MCQ and Code, or
                  generate with AI.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={addQuestion}
                    className="px-8 py-4 bg-[#D6A419] text-[#0B2A4A] rounded-2xl font-bold text-lg hover:bg-[#eebb30] transition-transform hover:-translate-y-1 shadow-lg shadow-yellow-500/20 active:translate-y-0 active:scale-95"
                  >
                    Add First Question
                  </button>
                  <button
                    onClick={() => setShowAIModal(true)}
                    className="px-8 py-4 bg-white dark:bg-gray-800 text-[#0B2A4A] dark:text-white border-2 border-[#0B2A4A]/10 dark:border-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform hover:-translate-y-1 shadow-lg flex items-center gap-2"
                  >
                    <Sparkles size={20} className="text-[#D6A419]" /> AI
                    Generate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {showAIModal && (
          <AIGeneratorModal
            onClose={() => setShowAIModal(false)}
            onGenerate={handleAIGenerated}
          />
        )}
      </div>
    </div>
  );
};

export default ExamBuilder;
