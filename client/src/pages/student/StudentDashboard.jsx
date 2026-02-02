import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/api";
import { useConfirm } from "../../components/ConfirmDialog";
import { generateExamPDF } from "../../utils/pdfGenerator";
import { Download } from "lucide-react";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [courseExams, setCourseExams] = useState({}); // Map courseId -> exams array
  const navigate = useNavigate();
  const location = useLocation();
  const { showConfirm } = useConfirm();

  // Navigation Guard: Intercept Back Button
  useEffect(() => {
    // Push initial state to trap "Back" action
    window.history.pushState(null, "", window.location.href);

    const handlePopState = async (e) => {
      // Prevent immediate navigation away by pushing state back
      window.history.pushState(null, "", window.location.href);

      const isConfirmed = await showConfirm({
        title: "Logout Required",
        message:
          "You are attempting to leave the dashboard. Do you want to logout?",
        type: "warning",
        confirmText: "Logout & Exit",
        cancelText: "Stay Logged In",
      });

      if (isConfirmed) {
        localStorage.removeItem("studentToken");
        navigate("/", { replace: true });
      }
      // If canceled, user stays on the page (state already pushed back)
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("studentToken");
        const { data } = await api.get("/students/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudent(data);

        // Fetch results
        const { data: resultsData } = await api.get("/exams/my-results", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(resultsData);

        // Fetch exams for all enrolled courses
        if (data.enrolledCourses) {
          const examsMap = {};
          await Promise.all(
            data.enrolledCourses.map(async (course) => {
              try {
                const { data: exams } = await api.get(
                  `/exams/course/${course._id}/all`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  },
                );
                examsMap[course._id] = exams;
              } catch {
                console.error(`Failed to load exams for ${course.title}`);
              }
            }),
          );
          setCourseExams(examsMap);
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("studentToken");
        navigate("/student/login");
      }
    };
    fetchProfile();
  }, [navigate, location]);

  if (!student) return <div className="text-center mt-20">Loading...</div>;

  // Separate attempted and available exams
  const attemptedExams = [];
  const availableExams = [];

  if (student.enrolledCourses) {
    student.enrolledCourses.forEach((course) => {
      const exams = courseExams[course._id] || [];
      exams.forEach((exam) => {
        const result = results.find((r) => {
          const rExamId = r.examId?._id || r.examId;
          const isMatch = String(rExamId) === String(exam._id);
          return isMatch;
        });

        if (result) {
          attemptedExams.push({ ...exam, course, result });
        } else {
          availableExams.push({ ...exam, course });
        }
      });
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 md:px-10 pb-10">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-[#0B2A4A] mb-2">
            Welcome, {student.name}!
          </h1>
          <p className="text-gray-600">
            Email: {student.email} | Mobile: {student.mobile}
          </p>
        </div>

        {/* Available Exams Section */}
        {availableExams.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#0B2A4A] mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-[#D6A419] rounded"></span>
              Available Exams
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableExams.map((exam) => (
                <div
                  key={exam._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-[#D6A419] hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="bg-gradient-to-r from-[#D6A419] to-yellow-500 p-4">
                    <h3 className="text-lg font-bold text-[#0B2A4A]">
                      {exam.title}
                    </h3>
                    <p className="text-sm text-[#0B2A4A]/80 mt-1">
                      {exam.course.title}
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{exam.durationMinutes} mins</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>{exam.questions?.length || 0} questions</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/student/exam/${exam._id}`)}
                      className="w-full bg-[#D6A419] text-[#0B2A4A] font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors shadow-md hover:shadow-lg"
                    >
                      Start Exam
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attempted Exams Section */}
        {attemptedExams.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#0B2A4A] mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-green-500 rounded"></span>
              Completed Exams
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attemptedExams.map((exam) => {
                const isPassed =
                  (exam.result.scorePercentage || 0) >=
                  (exam.passingScore || 0);
                return (
                  <div
                    key={exam._id}
                    className={`bg-white rounded-xl shadow-md overflow-hidden border-2 ${
                      isPassed ? "border-green-500" : "border-red-500"
                    } hover:shadow-xl transition-all`}
                  >
                    <div
                      className={`p-4 ${
                        isPassed
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : "bg-gradient-to-r from-red-500 to-red-600"
                      }`}
                    >
                      <h3 className="text-lg font-bold text-white">
                        {exam.title}
                      </h3>
                      <p className="text-sm text-white/90 mt-1">
                        {exam.course.title}
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-gray-600">
                            Score
                          </span>
                          <span
                            className={`text-2xl font-bold ${
                              isPassed ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {exam.result.correctAnswers || 0}/
                            {exam.result.totalQuestions || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-500">
                            Percentage
                          </span>
                          <span
                            className={`text-lg font-bold ${
                              isPassed ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {(exam.result.scorePercentage || 0).toFixed(1)}%
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <span
                            className={`text-sm font-bold ${
                              isPassed ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {isPassed ? "✓ PASSED" : "✗ FAILED"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          generateExamPDF(exam, exam.result, student)
                        }
                        className="w-full bg-[#0B2A4A] text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <Download size={20} /> Download Report
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {availableExams.length === 0 && attemptedExams.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Exams Available
            </h3>
            <p className="text-gray-500 mb-6">
              {student.enrolledCourses && student.enrolledCourses.length > 0
                ? "Your enrolled courses don't have any exams yet."
                : "You are not enrolled in any courses yet."}
            </p>
            {(!student.enrolledCourses ||
              student.enrolledCourses.length === 0) && (
              <button
                onClick={() => navigate("/course")}
                className="px-6 py-3 bg-[#D6A419] text-[#0B2A4A] font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Browse Courses
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
