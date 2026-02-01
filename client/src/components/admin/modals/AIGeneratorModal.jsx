import React, { useState } from "react";
import {
  Sparkles,
  X,
  Loader2,
  BookOpen,
  Hash,
  BarChart3,
  ListFilter,
} from "lucide-react";
import api from "../../../api/api";
import { useAlert } from "../../../context/AlertContext";

const AIGeneratorModal = ({ onClose, onGenerate }) => {
  const { showError, showSuccess } = useAlert();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    count: 5,
    difficulty: "medium",
    questionType: "mixed",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      showError("Please enter a topic");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/ai/generate-questions", formData);
      onGenerate(data);
      showSuccess(`Successfully generated ${data.length} questions!`);
      onClose();
    } catch (error) {
      console.error("AI Generation Error:", error);
      showError("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-700 m-4 transform animate-in scale-95 zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0B2A4A] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D6A419] rounded-lg text-[#0B2A4A]">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                AI Question Generator
              </h3>
              <p className="text-blue-200 text-xs">Powered by Gemini AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Topic */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <BookOpen size={16} className="text-[#D6A419]" />
              Topic / Subject
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g. React Hooks, Organic Chemistry, World War II"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419] outline-none transition-all dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Count */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Hash size={16} className="text-[#D6A419]" />
                Count (1-20)
              </label>
              <input
                type="number"
                name="count"
                min="1"
                max="20"
                value={formData.count}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-[#D6A419] outline-none transition-all dark:text-white"
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <BarChart3 size={16} className="text-[#D6A419]" />
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-[#D6A419] outline-none transition-all dark:text-white cursor-pointer"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ListFilter size={16} className="text-[#D6A419]" />
              Question Type
            </label>
            <select
              name="questionType"
              value={formData.questionType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-[#D6A419] outline-none transition-all dark:text-white cursor-pointer"
            >
              <option value="mixed">Mixed (Recommended)</option>
              <option value="single-choice">Single Choice</option>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True / False</option>
              <option value="fill-blank">Fill in the Blank</option>
              <option value="code">Code Snippet</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-4 border border-gray-200 dark:border-gray-600 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex-[2] py-3 px-4 bg-[#D6A419] text-[#0B2A4A] rounded-xl font-bold hover:bg-[#eebb30] transition-colors shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Questions
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGeneratorModal;
