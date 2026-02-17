import React, { useState, useEffect } from "react";
import {
  Award,
  ArrowRight,
  Trash2,
  FileText,
  Key,
  Table,
  FileJson,
  Plus,
} from "lucide-react";
import {
  exportExamCSV,
  exportExamJSON,
  exportExamPDF,
} from "../../utils/examExporter";
import api from "../../api/api";
import ExamBuilder from "../../components/admin/ExamBuilder";
import CertificateSettings from "../../components/admin/CertificateSettings";
import { useAlert } from "../../context/AlertContext";
import { useConfirm } from "../../components/ConfirmDialog";

const CertificationManagement = () => {
  const { showError } = useAlert();
  const { showConfirm } = useConfirm();
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null); // null = list, "new" = create, ID = edit
  const [selectedCertExamId, setSelectedCertExamId] = useState(null); // ID for certificate settings
  const [initialBuilderTab, setInitialBuilderTab] = useState("general");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificationExams();
  }, []);

  const fetchCertificationExams = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/certification-exams/admin/all");
      setExams(data);
    } catch (error) {
      console.error("Failed to fetch certification exams", error);
      showError("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId, examTitle) => {
    const isConfirmed = await showConfirm({
      title: "Delete Certification Exam",
      message: `Are you sure you want to delete "${examTitle}"? This action cannot be undone.`,
      type: "danger",
      confirmText: "Delete",
    });

    if (isConfirmed) {
      try {
        await api.delete(`/certification-exams/${examId}`);
        fetchCertificationExams(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete exam");
        showError("Failed to delete exam. Please try again.");
      }
    }
  };

  if (selectedExamId) {
    // Full-screen exam builder - Direct Integration
    return (
      <ExamBuilder
        type="certification" // Special type to bypass courseId
        examId={selectedExamId}
        initialTab={initialBuilderTab}
        onSave={() => {
          fetchCertificationExams();
          setSelectedExamId(null);
        }}
        onCancel={() => setSelectedExamId(null)}
      />
    );
  }

  if (selectedCertExamId) {
    return (
      <CertificateSettings
        examId={selectedCertExamId}
        onSave={() => {
          fetchCertificationExams();
          // Optional: keep it open or close it? usually close
          // But let's close it
          setSelectedCertExamId(null);
        }}
        onCancel={() => setSelectedCertExamId(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0B2A4A] dark:text-white">
            Certification Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage exams for external students (not tied to courses).
          </p>
        </div>
        <button
          onClick={() => {
            setInitialBuilderTab("general");
            setSelectedExamId("new");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#D6A419] text-[#0B2A4A] rounded-lg font-bold hover:bg-yellow-400 shadow-md transition-all active:scale-95"
        >
          <Plus size={20} />
          Create New Exam
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : exams.length > 0 ? (
          <div className="grid gap-4">
            {exams.map((exam) => (
              <div
                key={exam._id}
                className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#D6A419] transition-all flex justify-between items-center group"
              >
                <div
                  onClick={() => {
                    setInitialBuilderTab("general");
                    setSelectedExamId(exam._id);
                  }}
                  className="flex-1 cursor-pointer"
                >
                  <h3 className="font-bold text-lg text-[#0B2A4A] dark:text-white group-hover:text-[#D6A419]">
                    {exam.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {exam.questions?.length || 0} Questions •{" "}
                    {exam.durationMinutes} Minutes • Pass: {exam.passingScore}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Export Actions */}
                  <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 mr-2 shadow-sm border border-gray-100 dark:border-gray-600">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportExamPDF(exam, false);
                      }}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Download Question Paper"
                    >
                      <FileText size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportExamPDF(exam, true);
                      }}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Download Answer Key"
                    >
                      <Key size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportExamCSV(exam);
                      }}
                      className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Export CSV"
                    >
                      <Table size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportExamJSON(exam);
                      }}
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Export JSON"
                    >
                      <FileJson size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCertExamId(exam._id);
                      }}
                      className="p-2 text-gray-500 hover:text-[#D6A419] hover:bg-yellow-50 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Certificate Settings"
                    >
                      <Award size={18} />
                    </button>
                  </div>

                  <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExam(exam._id, exam.title);
                    }}
                    className="p-2.5 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete Exam"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setInitialBuilderTab("general");
                      setSelectedExamId(exam._id);
                    }}
                    className="p-2.5 text-gray-400 hover:text-[#D6A419] hover:bg-[#D6A419]/10 rounded-lg transition-colors"
                    title="Edit Exam"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-[#D6A419]">
              <Award size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
              No Certification Exams
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first exam for external students.
            </p>
            <button
              onClick={() => setSelectedExamId("new")}
              className="px-6 py-2 bg-[#0B2A4A] text-white rounded-lg font-bold hover:bg-[#1a4c7c] transition-colors"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationManagement;
