import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useConfirm } from "../../components/ConfirmDialog";
import { Download, LogOut, FileText, CheckCircle, Clock } from "lucide-react";
import logo from "../../assets/logo.png";

const CertificationDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showConfirm } = useConfirm();

  useEffect(() => {
    fetchProfileAndExams();
  }, []);

  const fetchProfileAndExams = async () => {
    try {
      const token = localStorage.getItem("studentToken");
      if (!token) {
        navigate("/certification/login");
        return;
      }

      setLoading(true);

      // Perform requests in parallel for better performance
      const [profileRes, examsRes, resultsRes] = await Promise.allSettled([
        api.get("/external/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/certification-exams/external/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/certification-exams/my-results", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Handle Profile Response
      if (profileRes.status === "fulfilled") {
        const { data } = profileRes.value;
        // API returns { message: "...", user: { ... } }
        setStudent(data.user || data);
      } else {
        console.error("Profile Fetch Error:", profileRes.reason);
        if (profileRes.reason?.response?.status === 401) {
          localStorage.removeItem("studentToken");
          navigate("/certification/login");
          return;
        }
      }

      // Handle Exams Response
      if (examsRes.status === "fulfilled") {
        setExams(examsRes.value.data);
      } else {
        console.error("Exams Fetch Error:", examsRes.reason);
      }

      // Handle Results Response
      if (resultsRes.status === "fulfilled") {
        setResults(resultsRes.value.data);
      } else {
        console.error("Results Fetch Error:", resultsRes.reason);
      }
    } catch (error) {
      console.error("Dashboard Critical Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const isConfirmed = await showConfirm({
      title: "Logout",
      message: "Are you sure you want to logout?",
      type: "warning",
      confirmText: "Logout",
    });

    if (isConfirmed) {
      localStorage.removeItem("studentToken");
      localStorage.removeItem("studentInfo");
      navigate("/certification/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0B2A4A] border-t-[#D6A419] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-[#0B2A4A] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg">
                <img
                  src={logo}
                  alt="IITM Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wide">
                  IITM EDUCATION
                </h1>
                <p className="text-xs text-blue-200">Certification Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:block text-right">
                <p className="font-bold text-white">{student?.name}</p>
                <p className="text-xs text-blue-200">{student?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-blue-200 hover:text-white"
                title="Logout"
              >
                <LogOut size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Separate exams into available and attempted */}
        {(() => {
          const attemptedExams = [];
          const availableExams = [];

          exams.forEach((exam) => {
            const result = results.find((r) => {
              const rExamId = r.examId?._id || r.examId;
              return String(rExamId) === String(exam._id);
            });

            if (result) {
              attemptedExams.push({ ...exam, result });
            } else {
              availableExams.push(exam);
            }
          });

          return (
            <>
              {/* Available Exams Section */}
              {availableExams.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-[#0B2A4A] mb-2">
                    Available Assessments
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Select an exam below to begin your certification process.
                  </p>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableExams.map((exam) => (
                      <div
                        key={exam._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1 group"
                      >
                        <div className="h-2 bg-gradient-to-r from-[#0B2A4A] to-[#1a4c7c]"></div>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-[#0B2A4A] group-hover:text-[#D6A419] transition-colors line-clamp-2 min-h-[3.5rem]">
                              {exam.title}
                            </h3>
                          </div>

                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-gray-600 text-sm">
                              <Clock size={16} className="text-[#D6A419]" />
                              <span>{exam.durationMinutes} Minutes</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 text-sm">
                              <FileText size={16} className="text-[#D6A419]" />
                              <span>
                                {exam.questions?.length || 0} Questions
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 text-sm">
                              <CheckCircle
                                size={16}
                                className="text-[#D6A419]"
                              />
                              <span>PASS: {exam.passingScore}%</span>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              navigate(`/certification/exam/${exam._id}`)
                            }
                            className="w-full bg-[#0B2A4A] text-white font-bold py-3 rounded-lg hover:bg-[#D6A419] hover:text-[#0B2A4A] transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            Start Exam
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Exams Section */}
              {attemptedExams.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-[#0B2A4A] mb-2 flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-500 rounded"></span>
                    Completed Exams
                  </h2>
                  <p className="text-gray-600 mb-6">
                    View your exam results and download certificates.
                  </p>

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
                                  {(exam.result.scorePercentage || 0).toFixed(
                                    1,
                                  )}
                                  %
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

                            {/* Download Certificate Button - Only for Passed Exams */}
                            {isPassed && (
                              <button
                                onClick={() => {
                                  const token =
                                    localStorage.getItem("studentToken");
                                  const baseURL =
                                    api.defaults.baseURL ||
                                    "http://localhost:5000";
                                  const url = `${baseURL}/certification-exams/certificate/${exam.result._id}?token=${token}`;
                                  // Open PDF in new tab
                                  window.open(url, "_blank");
                                }}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center gap-2"
                              >
                                <Download size={20} />
                                Download Certificate
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {availableExams.length === 0 && attemptedExams.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No Active Exams
                  </h3>
                  <p className="text-gray-500">
                    There are currently no exams available for you to take.
                  </p>
                </div>
              )}
            </>
          );
        })()}
      </main>
    </div>
  );
};

export default CertificationDashboard;
