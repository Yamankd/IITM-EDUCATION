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
} from "lucide-react";
import { useAlert } from "../../context/AlertContext";
import { useConfirm } from "../../components/ConfirmDialog";

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

  const handleOptionSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
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
      const formattedAnswers = Object.keys(answers).map((qId) => ({
        questionId: qId,
        selectedOptionIndex: answers[qId],
      }));

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="text-[#0B2A4A]" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-[#0B2A4A] mb-2">
              {exam.title}
            </h1>
            <p className="text-gray-500">{exam.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
              <Clock className="w-6 h-6 mx-auto mb-2 text-[#D6A419]" />
              <div className="font-bold text-gray-800">
                {exam.durationMinutes} mins
              </div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
              <Info className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="font-bold text-gray-800">
                {exam.questions.length}
              </div>
              <div className="text-xs text-gray-500">questions</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="font-bold text-gray-800">{exam.passingScore}</div>
              <div className="text-xs text-gray-500">Passing Score</div>
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-xl p-6 mb-8 border border-blue-100">
            <h3 className="font-bold text-[#0B2A4A] mb-4 flex items-center gap-2">
              <Info size={18} /> Instructions
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="font-bold text-blue-500">•</span>
                The timer will start immediately after you click "Start Exam".
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-500">•</span>
                Do not switch tabs or minimize the window during the exam.
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-500">•</span>
                You can mark questions for review and return to them later.
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-500">•</span>
                The exam will auto-submit when the time expires.
              </li>
            </ul>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full py-4 bg-[#D6A419] text-[#0B2A4A] font-bold rounded-xl shadow-lg hover:bg-yellow-400 hover:shadow-xl transition-all transform active:scale-[0.98] text-lg flex items-center justify-center gap-2"
          >
            <PlayCircle size={24} /> Start Exam
          </button>
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
          <button
            onClick={handleExit}
            className="w-full py-3 bg-[#D6A419] text-[#0B2A4A] font-bold rounded-xl hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={20} /> Exit
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm z-20 px-4 md:px-6 py-3 flex justify-between items-center h-16 flex-shrink-0">
        <h1 className="text-lg md:text-xl font-bold text-[#0B2A4A] truncate max-w-[50%]">
          {exam.title}
        </h1>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 300 ? "text-red-500 animate-pulse" : "text-[#D6A419]"}`}
          >
            <Clock size={24} />
            {formatTime(timeLeft)}
          </div>
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content - Question Area */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8">
          {/* Question Card */}
          <div className="flex-1 max-w-4xl mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 mb-6">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[#D6A419] font-bold text-lg">
                  Question {currentQuestionIndex + 1}
                </span>
                <button
                  onClick={toggleMarkForReview}
                  className={`flex items-center gap-1 text-sm font-medium ${markedForReview.has(currentQuestion._id) ? "text-purple-600" : "text-gray-400 hover:text-gray-600"}`}
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
                    ? "Marked"
                    : "Mark for Review"}
                </button>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
                {currentQuestion.questionText}
              </h2>

              <div className="space-y-4">
                {currentQuestion.options.map((opt, index) => (
                  <label
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers[currentQuestion._id] === index
                        ? "border-[#D6A419] bg-yellow-50"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        answers[currentQuestion._id] === index
                          ? "border-[#D6A419]"
                          : "border-gray-300"
                      }`}
                    >
                      {answers[currentQuestion._id] === index && (
                        <div className="w-3 h-3 rounded-full bg-[#D6A419]" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name={`q-${currentQuestion._id}`}
                      className="hidden"
                      checked={answers[currentQuestion._id] === index}
                      onChange={() =>
                        handleOptionSelect(currentQuestion._id, index)
                      }
                    />
                    <span className="text-gray-700 font-medium">
                      {opt.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Navigation Bar */}
          <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row gap-4 justify-between items-center py-4">
            <button
              onClick={clearResponse}
              className="text-gray-500 font-medium hover:text-red-500 transition-colors text-sm"
            >
              Clear Response
            </button>

            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={() => navigateQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ChevronLeft size={20} /> Previous
              </button>
              <button
                onClick={() => navigateQuestion(currentQuestionIndex + 1)}
                disabled={currentQuestionIndex === exam.questions.length - 1}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-[#0B2A4A] text-white font-bold hover:bg-[#0f3b68] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                Next <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Question Palette */}
        <div
          className={`
             fixed inset-y-0 right-0 z-30 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
             ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
             md:relative md:translate-x-0 md:w-80 md:shadow-none md:border-l md:border-gray-200
        `}
        >
          {/* User Info / Legend */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                {studentProfile?.name?.charAt(0).toUpperCase() || "S"}
              </div>
              <div>
                <p className="font-bold text-[#0B2A4A]">
                  {studentProfile?.name || "Student"}
                </p>
                <p className="text-xs text-gray-500">
                  {studentProfile?.enrolledCourses?.[0]?.title || "Course"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>{" "}
                Answered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> Not
                Answered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>{" "}
                Marked
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div> Not
                Visited
              </div>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="font-bold text-gray-800 mb-4">Question Palette</h3>
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((q, index) => {
                const status = getQuestionStatus(index, q._id);
                const colorClass = getStatusColor(status);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      navigateQuestion(index);
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    className={`
                                    aspect-square rounded-lg font-bold text-sm bg-gray-100 
                                    flex items-center justify-center border-2 transition-all
                                    ${colorClass}
                                    ${currentQuestionIndex === index ? "ring-2 ring-offset-2 ring-[#0B2A4A]" : ""}
                                `}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-[#D6A419] text-[#0B2A4A] font-bold rounded-xl shadow-lg hover:bg-yellow-400 hover:shadow-xl transition-all transform active:scale-95 text-lg"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ExamPortal;
