import React, { useState, useEffect } from "react";
import {
  BookOpen,
  ArrowRight,
  Award,
  Trash2,
  Download,
  FileText,
  Key,
  Table,
  FileJson,
} from "lucide-react";
import {
  exportExamCSV,
  exportExamJSON,
  exportExamPDF,
} from "../../utils/examExporter";
import api from "../../api/api";
import ExamBuilder from "../../components/admin/ExamBuilder";
import { useAlert } from "../../context/AlertContext";
import { useConfirm } from "../../components/ConfirmDialog";

const ExamsView = () => {
  const { showError } = useAlert();
  const { showConfirm } = useConfirm();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null); // null = list, "new" = create, ID = edit

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses");
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses");
    }
  };

  const fetchExams = async (courseId) => {
    try {
      const { data } = await api.get(`/exams/admin/course/${courseId}/all`);
      setExams(data);
    } catch (error) {
      console.error("Failed to fetch exams");
    }
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourseId(courseId);
    fetchExams(courseId);
    setSelectedExamId(null);
  };

  const handleDeleteExam = async (examId, examTitle) => {
    const isConfirmed = await showConfirm({
      title: "Delete Exam",
      message: `Are you sure you want to delete "${examTitle}"? This action cannot be undone.`,
      type: "danger",
      confirmText: "Delete",
    });

    if (isConfirmed) {
      try {
        await api.delete(`/exams/${examId}`);
        fetchExams(selectedCourseId); // Refresh the list
      } catch (error) {
        console.error("Failed to delete exam");
        showError("Failed to delete exam. Please try again.");
      }
    }
  };

  if (selectedCourseId) {
    if (selectedExamId) {
      // Full-screen exam builder - direct integration
      return (
        <ExamBuilder
          courseId={selectedCourseId}
          examId={selectedExamId}
          onSave={() => {
            fetchExams(selectedCourseId);
            setSelectedExamId(null);
          }}
          onCancel={() => setSelectedExamId(null)}
        />
      );
    }

    return (
      <div className="animate-in fade-in zoom-in duration-300">
        <button
          onClick={() => setSelectedCourseId(null)}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-[#0B2A4A] dark:text-gray-400 dark:hover:text-white transition-colors font-medium"
        >
          <ArrowRight className="rotate-180" size={20} />
          Back to Course List
        </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#0B2A4A] dark:text-white">
            Exams for Course
          </h2>
          <button
            onClick={() => setSelectedExamId("new")}
            className="flex items-center gap-2 px-4 py-2 bg-[#D6A419] text-[#0B2A4A] rounded-lg font-bold hover:bg-yellow-400"
          >
            Create New Exam
          </button>
        </div>

        <div className="grid gap-4">
          {exams.length > 0 ? (
            exams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-[#D6A419] transition-all flex justify-between items-center group"
              >
                <div
                  onClick={() => setSelectedExamId(exam._id)}
                  className="flex-1 cursor-pointer"
                >
                  <h3 className="font-bold text-lg text-[#0B2A4A] dark:text-white group-hover:text-[#D6A419]">
                    {exam.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {exam.questions.length} Questions • {exam.durationMinutes}{" "}
                    Minutes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Export Actions */}
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportExamPDF(exam, false);
                      }}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                      title="Download Question Paper"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportExamPDF(exam, true);
                      }}
                      className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                      title="Download Answer Key"
                    >
                      <Key size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportExamCSV(exam);
                      }}
                      className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                      title="Export CSV"
                    >
                      <Table size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportExamJSON(exam);
                      }}
                      className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                      title="Export JSON"
                    >
                      <FileJson size={16} />
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExam(exam._id, exam.title);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete Exam"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedExamId(exam._id)}
                    className="p-2"
                  >
                    <ArrowRight
                      size={20}
                      className="text-gray-400 group-hover:text-[#D6A419]"
                    />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-xl">
              No exams found. Create one to get started.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-[#0B2A4A] dark:text-white">
          Exam Management
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Select a course to manage its exams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            onClick={() => handleCourseSelect(course._id)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-[#D6A419] dark:hover:border-[#D6A419] transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#D6A419]/10 dark:bg-[#D6A419]/20 rounded-xl flex items-center justify-center text-[#0B2A4A] dark:text-[#D6A419] group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold text-gray-500 dark:text-gray-300">
                {course.category || "General"}
              </div>
            </div>

            <h3 className="font-bold text-lg text-[#0B2A4A] dark:text-white mb-2 line-clamp-1 group-hover:text-[#D6A419] transition-colors">
              {course.title}
            </h3>

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Award size={16} />
              <span>Manage Exams</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamsView;
