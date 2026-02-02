import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Flag,
  Info,
  PlayCircle,
  FileText,
  LogOut,
  ShieldCheck,
  Download,
} from "lucide-react";
import { useAlert } from "../../context/AlertContext";
import { useConfirm } from "../../components/ConfirmDialog";
import { generateExamPDF } from "../../utils/pdfGenerator";

const ExamPortal = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { showError, showInfo } = useAlert();
  const { showConfirm } = useConfirm();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Exam State
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [markedForReview, setMarkedForReview] = useState(new Set());

  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle
  const [studentProfile, setStudentProfile] = useState(null); // Student info

  useEffect(() => {
    fetchExam();
    fetchStudentProfile();
  }, [examId]);

  // Load Saved State or Initialize
  useEffect(() => {
    if (exam && !result) {
      const savedState = localStorage.getItem(`exam_state_${examId}`);
      if (savedState) {
        const {
          timeLeft: _savedTimeLeft,
          answers: savedAnswers,
          visitedQuestions: savedVisited,
          markedForReview: savedMarked,
          currentQuestionIndex: savedIndex,
          startTime,
          examStarted: savedExamStarted,
        } = JSON.parse(savedState);

        // Resume if already started
        if (savedExamStarted) {
          setExamStarted(true);
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          const actualTimeLeft = Math.max(
            0,
            exam.durationMinutes * 60 - elapsed,
          );
          setTimeLeft(actualTimeLeft);
          setAnswers(savedAnswers || {});
          setVisitedQuestions(new Set(savedVisited || [0]));
          setMarkedForReview(new Set(savedMarked || []));
          setCurrentQuestionIndex(savedIndex || 0);
        }
      }
    }
  }, [exam, examId, result]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (exam && examStarted && !result) {
      const savedState = localStorage.getItem(`exam_state_${examId}`);
      let startTime = Date.now();

      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.startTime) startTime = parsed.startTime;
      } else {
        // Initial start time when first started
        localStorage.setItem(
          `exam_state_${examId}`,
          JSON.stringify({ startTime }),
        );
      }

      const stateToSave = {
        timeLeft,
        answers,
        visitedQuestions: Array.from(visitedQuestions),
        markedForReview: Array.from(markedForReview),
        currentQuestionIndex,
        startTime,
        examStarted: true,
      };
      localStorage.setItem(`exam_state_${examId}`, JSON.stringify(stateToSave));
    }
  }, [
    examId,
    timeLeft,
    answers,
    visitedQuestions,
    markedForReview,
    currentQuestionIndex,
    exam,
    examStarted,
    result,
  ]);

  // Timer Logic
  useEffect(() => {
    if (!examStarted || result || timeLeft === null) return;

    if (timeLeft === 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, result, examStarted]);

  // Comprehensive exit prevention (Only when examStarted and not submitted)
  useEffect(() => {
    if (!examStarted || result) return;

    // Prevent browser back button
    const handlePopState = (e) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
      showError(
        "You cannot go back during the exam. Please submit the exam to exit.",
      );
    };

    // Prevent tab/window close
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "Your exam is in progress. Are you sure you want to leave? Your progress will be saved but the timer will continue.";
      return e.returnValue;
    };

    // Prevent keyboard shortcuts for navigation
    const handleKeyDown = (e) => {
      // Prevent Alt+Left (back), Alt+Right (forward)
      if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault();
        showError("Navigation is disabled during the exam.");
      }
      // Prevent Backspace navigation (when not in input)
      if (
        e.key === "Backspace" &&
        !["INPUT", "TEXTAREA"].includes(e.target.tagName)
      ) {
        e.preventDefault();
      }
    };

    // Push initial state to prevent back navigation
    window.history.pushState(null, "", window.location.href);

    // Add event listeners
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [result, examStarted]);

  const fetchExam = async () => {
    try {
      const token = localStorage.getItem("studentToken");
      const { data } = await api.get(`/exams/${examId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExam(data);
    } catch (error) {
      console.error(error);
      showError("Exam not found.");
      navigate("/student/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem("studentToken");
      const { data } = await api.get("/students/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentProfile(data);
    } catch (error) {
      console.error("Failed to fetch student profile:", error);
    }
  };

  const handleStartExam = () => {
    setExamStarted(true);
    if (timeLeft === null) {
      setTimeLeft(exam.durationMinutes * 60);
    }
  };

  const handleAnswerChange = (value, type) => {
    const qId = currentQuestion._id;

    setAnswers((prev) => {
      if (type === "multiple-choice") {
        const currentSelected = Array.isArray(prev[qId]) ? prev[qId] : [];
        if (currentSelected.includes(value)) {
          return { ...prev, [qId]: currentSelected.filter((i) => i !== value) };
        } else {
          return { ...prev, [qId]: [...currentSelected, value] };
        }
      }

      // Single Choice / True-False -> Single index
      // Fill-Blank / Code -> String value
      return {
        ...prev,
        [qId]: value,
      };
    });
  };

  const clearResponse = () => {
    const questionId = exam.questions[currentQuestionIndex]._id;
    const newAnswers = { ...answers };
    delete newAnswers[questionId];
    setAnswers(newAnswers);
  };

  const toggleMarkForReview = () => {
    const questionId = exam.questions[currentQuestionIndex]._id;
    const newMarked = new Set(markedForReview);
    if (newMarked.has(questionId)) {
      newMarked.delete(questionId);
    } else {
      newMarked.add(questionId);
    }
    setMarkedForReview(newMarked);
  };

  const navigateQuestion = (index) => {
    if (index >= 0 && index < exam.questions.length) {
      setCurrentQuestionIndex(index);
      setVisitedQuestions((prev) => new Set(prev).add(index));
    }
  };

  const getQuestionStatus = (index, questionId) => {
    if (answers[questionId] !== undefined) return "answered";
    if (markedForReview.has(questionId)) return "marked";
    if (visitedQuestions.has(index)) return "not_answered";
    return "not_visited";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "answered":
        return "bg-green-500 text-white border-green-600";
      case "marked":
        return "bg-purple-500 text-white border-purple-600";
      case "not_answered":
        return "bg-red-500 text-white border-red-600";
      default:
        return "bg-gray-200 text-gray-700 border-gray-300"; // not visited
    }
  };

  const handleAutoSubmit = () => {
    showInfo("Time is up! Submitting your exam automatically.");
    submitExam();
  };

  const handleSubmit = async () => {
    const isConfirmed = await showConfirm({
      title: "Submit Exam",
      message: "Are you sure you want to finish the exam?",
      type: "info",
      confirmText: "Submit",
    });

    if (isConfirmed) {
      submitExam();
    }
  };

  const submitExam = async () => {
    try {
      const formattedAnswers = Object.keys(answers).map((qId) => {
        const answer = answers[qId];
        const question = exam.questions.find((q) => q._id === qId);
        const type = question?.questionType || "single-choice";

        let payload = { questionId: qId, questionType: type };

        if (type === "multiple-choice") {
          // Backend expects 'selectedOptionIndexes' for array comparison
          payload.selectedOptionIndexes = Array.isArray(answer) ? answer : [];
        } else if (type === "fill-blank" || type === "code") {
          // Backend expects 'textAnswer' for string comparison
          payload.textAnswer = String(answer);
        } else {
          payload.selectedOptionIndex = Number(answer);
        }
        return payload;
      });

      const token = localStorage.getItem("studentToken");
      const { data } = await api.post(
        "/exams/submit",
        {
          examId: exam._id,
          answers: formattedAnswers,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setResult(data);
      // Clear saved exam state after successful submission
      localStorage.removeItem(`exam_state_${examId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleExit = async () => {
    const isConfirmed = await showConfirm({
      title: "Logout?",
      message: "Do you want to logout from your profile?",
      type: "warning",
      confirmText: "Logout",
      cancelText: "Stay Logged In",
    });

    if (isConfirmed) {
      localStorage.removeItem("studentToken");
      navigate("/");
    } else {
      navigate("/student/dashboard", { replace: true });
    }
  };

  const handleDownloadPDF = () => {
    if (exam && result) {
      generateExamPDF(exam, result, studentProfile);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading Exam...
      </div>
    );

  // Welcome Screen
  if (!examStarted && !result) {
    return (
      <div className="min-h-screen w-full bg-[#0B2A4A] font-sans relative overflow-hidden flex flex-col">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#D6A419] blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#fff] blur-[120px]" />
        </div>

        {/* Top Navigation Bar (Visual Only) */}
        <div className="w-full px-8 py-6 z-20 flex justify-between items-center bg-white/5 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#D6A419]">
              <FileText className="text-[#0B2A4A] w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">
              Exam Portal
            </span>
          </div>
          <div className="text-sm font-medium text-blue-200">
            {studentProfile?.name || "Student"}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center relative z-10 px-6 md:px-16 lg:px-24 gap-12 max-w-[1600px] mx-auto w-full">
          {/* LEFT COLUMN: Hero Section */}
          <div className="flex-1 text-left space-y-8 animate-in slide-in-from-left-8 duration-700">
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-[#D6A419]/20 border border-[#D6A419]/30 text-[#D6A419] font-bold text-sm mb-4 backdrop-blur-md">
                READY TO START
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                {exam.title}
              </h1>
              <p className="text-xl text-blue-100/80 leading-relaxed max-w-2xl">
                {exam.description ||
                  "You are about to enter a secure examination environment. Please review the instructions carefully before proceeding."}
              </p>
            </div>

            {/* Quick Stats Row */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-xl backdrop-blur-sm">
                <Clock className="text-[#D6A419] w-6 h-6" />
                <div>
                  <p className="text-xs text-blue-300 uppercase font-bold">
                    Duration
                  </p>
                  <p className="text-lg font-bold text-white">
                    {exam.durationMinutes} mins
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-xl backdrop-blur-sm">
                <Info className="text-[#D6A419] w-6 h-6" />
                <div>
                  <p className="text-xs text-blue-300 uppercase font-bold">
                    Questions
                  </p>
                  <p className="text-lg font-bold text-white">
                    {exam.questions.length} Total
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-xl backdrop-blur-sm">
                <CheckCircle className="text-[#D6A419] w-6 h-6" />
                <div>
                  <p className="text-xs text-blue-300 uppercase font-bold">
                    Passing
                  </p>
                  <p className="text-lg font-bold text-white">
                    {exam.passingScore}% Score
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                onClick={handleStartExam}
                className="group relative overflow-hidden px-12 py-5 bg-[#D6A419] text-[#0B2A4A] font-bold rounded-2xl shadow-2xl shadow-[#D6A419]/20 hover:bg-[#eebb30] transition-all transform hover:-translate-y-1 active:translate-y-0 text-xl flex items-center gap-4"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                <span>Begin Assessment</span>
                <PlayCircle
                  size={28}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Instructions Panel */}
          <div className="flex-1 w-full max-w-xl animate-in slide-in-from-right-8 duration-700 delay-100">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
              <h3 className="font-bold text-2xl text-white mb-6 flex items-center gap-3">
                <Info className="text-[#D6A419]" size={28} />
                Instructions
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0B2A4A] border border-[#D6A419]/30 flex items-center justify-center flex-shrink-0 text-[#D6A419] font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">
                      Timer Starts Instantly
                    </h4>
                    <p className="text-blue-100/70 text-sm mt-1">
                      Once you click 'Begin Assessment', your session timer will
                      start precisely. There is no pause option.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0B2A4A] border border-[#D6A419]/30 flex items-center justify-center flex-shrink-0 text-[#D6A419] font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">
                      Full Screen Mode
                    </h4>
                    <p className="text-blue-100/70 text-sm mt-1">
                      Please keep the window maximized. Do not switch tabs or
                      minimize the browser to strictly adhere to exam integrity.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0B2A4A] border border-[#D6A419]/30 flex items-center justify-center flex-shrink-0 text-[#D6A419] font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">
                      Review & Submit
                    </h4>
                    <p className="text-blue-100/70 text-sm mt-1">
                      You can mark tricky questions for review. Ensure you click
                      'Submit' before the timer runs out.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-white/30 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                  <ShieldCheck size={14} /> Secure Exam Environment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div
            className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${result.isPassed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
          >
            {result.isPassed ? (
              <CheckCircle size={40} />
            ) : (
              <AlertCircle size={40} />
            )}
          </div>
          <h2 className="text-3xl font-bold text-[#0B2A4A] mb-2">
            {result.isPassed ? "Congratulations!" : "Keep Practicing"}
          </h2>
          <p className="text-gray-600 mb-6">
            {result.isPassed
              ? "You have passed the exam."
              : "Unfortunately, you did not pass."}
          </p>
          <div className="bg-gray-50 rounded-xl p-6 mb-8 grid grid-cols-2 gap-4">
            <div className="text-center">
              <span className="block text-gray-500 text-sm">Score</span>
              <span className="block text-2xl font-bold text-[#0B2A4A]">
                {result.scorePercentage.toFixed(1)}%
              </span>
            </div>
            <div className="text-center">
              <span className="block text-gray-500 text-sm">Correct</span>
              <span className="block text-2xl font-bold text-[#0B2A4A]">
                {result.correctAnswers} / {result.totalQuestions}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleDownloadPDF}
              className="w-full py-3 bg-[#0B2A4A] text-white font-bold rounded-xl hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={20} /> Download Report
            </button>
            <button
              onClick={handleExit}
              className="w-full py-3 bg-[#D6A419] text-[#0B2A4A] font-bold rounded-xl hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={20} /> Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="h-screen flex flex-col bg-[#0B2A4A] overflow-hidden relative font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#D6A419] opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#fff] opacity-10 blur-[120px]" />
      </div>

      {/* Header */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10 z-20 px-4 md:px-8 py-3 flex justify-between items-center h-16 flex-shrink-0 relative">
        <h1 className="text-lg md:text-xl font-bold text-white truncate max-w-[50%] flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-[#D6A419] items-center justify-center text-[#0B2A4A] hidden md:flex">
            <FileText size={18} />
          </span>
          {exam.title}
        </h1>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-1.5 rounded-lg border border-white/10 bg-black/20 ${timeLeft < 300 ? "text-red-400 animate-pulse border-red-500/50" : "text-[#D6A419]"}`}
          >
            <Clock size={20} />
            {formatTime(timeLeft)}
          </div>
          <button
            className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Main Content - Question Area */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8">
          {/* Question Card */}
          <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col justify-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10 mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#D6A419]" />

              <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                <span className="text-[#D6A419] font-bold text-sm tracking-widest uppercase">
                  Question {currentQuestionIndex + 1} of {exam.questions.length}
                </span>
                <button
                  onClick={toggleMarkForReview}
                  className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full transition-all ${markedForReview.has(currentQuestion._id) ? "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50" : "text-white/40 hover:text-white hover:bg-white/10"}`}
                >
                  <Flag
                    size={16}
                    fill={
                      markedForReview.has(currentQuestion._id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                  {markedForReview.has(currentQuestion._id)
                    ? "Marked for Review"
                    : "Mark for Review"}
                </button>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">
                {currentQuestion.questionText}
              </h2>

              <div className="space-y-4">
                {/* Dynamic Question Input Rendering */}
                {(() => {
                  const qType = currentQuestion.questionType || "single-choice";
                  const answer = answers[currentQuestion._id];

                  // --- Single Choice & True/False ---
                  if (qType === "single-choice" || qType === "true-false") {
                    return currentQuestion.options.map((opt, index) => (
                      <label
                        key={index}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                          answer === (opt.originalIndex ?? index)
                            ? "border-[#D6A419] bg-[#D6A419]/10 shadow-[0_0_15px_rgba(214,164,25,0.1)]"
                            : "border-white/10 hover:border-white/30 hover:bg-white/5"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            answer === (opt.originalIndex ?? index)
                              ? "border-[#D6A419]"
                              : "border-white/30 group-hover:border-white/50"
                          }`}
                        >
                          {answer === (opt.originalIndex ?? index) && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#D6A419]" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name={`q-${currentQuestion._id}`}
                          className="hidden"
                          checked={answer === (opt.originalIndex ?? index)}
                          onChange={() =>
                            handleAnswerChange(
                              opt.originalIndex ?? index,
                              qType,
                            )
                          }
                        />
                        <span
                          className={`text-lg font-medium ${answer === (opt.originalIndex ?? index) ? "text-white" : "text-blue-100/70"}`}
                        >
                          {opt.text}
                        </span>
                      </label>
                    ));
                  }

                  // --- Multiple Choice ---
                  if (qType === "multiple-choice") {
                    const selectedIndices = Array.isArray(answer) ? answer : [];
                    return currentQuestion.options.map((opt, index) => {
                      // Use originalIndex for tracking, or fallback to current index if not randomized
                      const value = opt.originalIndex ?? index;
                      const isSelected = selectedIndices.includes(value);
                      return (
                        <label
                          key={index}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                            isSelected
                              ? "border-[#D6A419] bg-[#D6A419]/10 shadow-[0_0_15px_rgba(214,164,25,0.1)]"
                              : "border-white/10 hover:border-white/30 hover:bg-white/5"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              isSelected
                                ? "bg-[#D6A419] border-[#D6A419]"
                                : "border-white/30 group-hover:border-white/50"
                            }`}
                          >
                            {isSelected && (
                              <CheckCircle
                                size={16}
                                className="text-[#0B2A4A]"
                              />
                            )}
                          </div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleAnswerChange(value, qType)}
                            className="hidden"
                          />
                          <span
                            className={`text-lg font-medium ${isSelected ? "text-white" : "text-blue-100/70"}`}
                          >
                            {opt.text}
                          </span>
                        </label>
                      );
                    });
                  }

                  // --- Fill in the Blank ---
                  if (qType === "fill-blank") {
                    return (
                      <div className="mt-4">
                        <input
                          type="text"
                          value={answer || ""}
                          onChange={(e) =>
                            handleAnswerChange(e.target.value, qType)
                          }
                          placeholder="Type your answer here..."
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-blue-200/30 focus:outline-none focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419] transition-all"
                        />
                      </div>
                    );
                  }

                  // --- Code / Short Answer ---
                  if (qType === "code") {
                    return (
                      <div className="mt-4">
                        <div className="bg-[#0B2A4A]/50 border border-white/10 rounded-xl overflow-hidden">
                          <div className="bg-black/20 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                            <span className="text-xs font-mono text-[#D6A419] uppercase">
                              Code Editor
                            </span>
                            <span className="text-xs text-blue-200/50">
                              {currentQuestion.codeLanguage || "text"}
                            </span>
                          </div>
                          <textarea
                            value={answer || ""}
                            onChange={(e) =>
                              handleAnswerChange(e.target.value, qType)
                            }
                            placeholder="// Write your code here..."
                            rows={10}
                            className="w-full bg-transparent border-none p-4 text-blue-100 font-mono text-sm focus:ring-0 resize-y"
                            spellCheck="false"
                          />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="text-red-400">Unknown Question Type</div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Bottom Navigation Bar */}
          <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row gap-4 justify-between items-center py-4">
            <button
              onClick={clearResponse}
              className="text-white/40 font-medium hover:text-red-400 transition-colors text-sm uppercase tracking-wider"
            >
              Clear Response
            </button>

            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={() => navigateQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                <ChevronLeft size={20} /> Previous
              </button>
              <button
                onClick={() => navigateQuestion(currentQuestionIndex + 1)}
                disabled={currentQuestionIndex === exam.questions.length - 1}
                className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-[#D6A419] text-[#0B2A4A] font-bold hover:bg-[#eebb30] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#D6A419]/20 transition-all transform active:scale-95"
              >
                Next <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Question Palette */}
        <div
          className={`
             fixed inset-y-0 right-0 z-30 w-80 bg-[#0B2A4A]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
             ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
             md:relative md:translate-x-0 md:w-80 md:shadow-none md:bg-transparent
        `}
        >
          {/* User Info / Legend */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#D6A419] flex items-center justify-center font-bold text-[#0B2A4A] shadow-lg shadow-[#D6A419]/20">
                {studentProfile?.name?.charAt(0).toUpperCase() || "S"}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-white truncate">
                  {studentProfile?.name || "Student"}
                </p>
                <p className="text-xs text-blue-200/60 truncate">
                  {studentProfile?.enrolledCourses?.[0]?.title || "Course"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-blue-100/60 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                Answered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                Not Answered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                Marked
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                Not Visited
              </div>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <h3 className="font-bold text-white/80 mb-4 text-sm uppercase tracking-wider">
              Question Palette
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((q, index) => {
                const status = getQuestionStatus(index, q._id);
                // Custom color logic for dark mode
                let statusClass = "bg-white/5 text-white/50 border-white/10"; // Default
                if (status === "answered")
                  statusClass =
                    "bg-green-500/20 text-green-400 border-green-500/50";
                if (status === "marked")
                  statusClass =
                    "bg-purple-500/20 text-purple-300 border-purple-500/50";
                if (status === "not_answered")
                  statusClass = "bg-red-500/20 text-red-400 border-red-500/50";

                return (
                  <button
                    key={index}
                    onClick={() => {
                      navigateQuestion(index);
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    className={`
                                    aspect-square rounded-lg font-bold text-sm 
                                    flex items-center justify-center border transition-all
                                    ${statusClass}
                                    ${currentQuestionIndex === index ? "ring-2 ring-offset-2 ring-offset-[#0B2A4A] ring-[#D6A419] text-white bg-[#D6A419]/20" : "hover:bg-white/10 hover:text-white"}
                                `}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-6 border-t border-white/10 bg-[#0B2A4A]/50 backdrop-blur-sm">
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-[#D6A419] text-[#0B2A4A] font-bold rounded-xl shadow-lg hover:bg-[#eebb30] hover:shadow-xl hover:shadow-[#D6A419]/20 transition-all transform active:scale-95 text-lg"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ExamPortal;
