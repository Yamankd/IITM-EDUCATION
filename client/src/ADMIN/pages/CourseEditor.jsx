import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  X,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  Image as ImageIcon,
  Layout,
  BookOpen,
  DollarSign,
  Globe,
} from "lucide-react";
import DropzoneArea from "./DropzoneArea";
import api from "../../api/api";

const CourseEditor = ({ course, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    level: "Beginner",
    duration: "",
    price: 0,
    salePrice: 0,
    isDraft: false,
    slug: "",
    metaTitle: "",
    metaDescription: "",
    description: "",
    longDescription: "",
    image: "",
    instructor: { name: "", bio: "", image: "" },
    learningOutcomes: [],
    requirements: [],
    syllabus: [],
  });

  const [currentOutcome, setCurrentOutcome] = useState("");
  const [currentRequirement, setCurrentRequirement] = useState("");
  const [currentSyllabusWeek, setCurrentSyllabusWeek] = useState({
    week: "",
    title: "",
    topics: "",
  });

  // Initialize form data if editing
  useEffect(() => {
    if (course) {
      setFormData(course);
    }
  }, [course]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (files, field) => {
    if (files.length === 0) return;
    const file = files[0];
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const { data } = await api.post("/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (field === "instructor.image") {
        setFormData((prev) => ({
          ...prev,
          instructor: { ...prev.instructor, image: data.url },
        }));
      } else {
        setFormData((prev) => ({ ...prev, [field]: data.url }));
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed");
    }
  };

  const addListItem = (field, value, clearFn) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
      clearFn("");
    }
  };

  const removeListItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addSyllabusWeek = () => {
    if (currentSyllabusWeek.week && currentSyllabusWeek.title) {
      const topicsArray =
        typeof currentSyllabusWeek.topics === "string"
          ? currentSyllabusWeek.topics
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : currentSyllabusWeek.topics;

      setFormData((prev) => ({
        ...prev,
        syllabus: [
          ...prev.syllabus,
          { ...currentSyllabusWeek, topics: topicsArray },
        ],
      }));
      setCurrentSyllabusWeek({ week: "", title: "", topics: "" });
    }
  };

  const removeSyllabusWeek = (index) => {
    setFormData((prev) => ({
      ...prev,
      syllabus: prev.syllabus.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#0B2A4A] dark:text-white">
              {course ? "Edit Course" : "Create New Course"}
            </h1>
            <p className="text-sm text-gray-500">
              {formData.isDraft ? "Draft Mode" : "Ready to Publish"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#D6A419] text-white hover:bg-yellow-600 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Save size={18} />
            Save Course
          </button>
        </div>
      </header>

      {/* Main Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-[#0B2A4A] mb-4 flex items-center gap-2">
                <Layout size={20} /> Course Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Course Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Complete Web Development Bootcamp"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-[#D6A419] outline-none text-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Short Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Full Description
                  </label>
                  <div className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                    <ReactQuill
                      theme="snow"
                      value={formData.longDescription}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          longDescription: value,
                        }))
                      }
                      className="h-64 mb-12"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Syllabus Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-[#0B2A4A] mb-4 flex items-center gap-2">
                <BookOpen size={20} /> Syllabus
              </h3>

              <div className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Week / Module (e.g. Week 1)"
                    value={currentSyllabusWeek.week}
                    onChange={(e) =>
                      setCurrentSyllabusWeek({
                        ...currentSyllabusWeek,
                        week: e.target.value,
                      })
                    }
                    className="px-3 py-2 rounded-lg border dark:bg-gray-700"
                  />
                  <input
                    placeholder="Title (e.g. Introduction)"
                    value={currentSyllabusWeek.title}
                    onChange={(e) =>
                      setCurrentSyllabusWeek({
                        ...currentSyllabusWeek,
                        title: e.target.value,
                      })
                    }
                    className="px-3 py-2 rounded-lg border dark:bg-gray-700"
                  />
                </div>
                <input
                  placeholder="Topics (comma separated)"
                  value={currentSyllabusWeek.topics}
                  onChange={(e) =>
                    setCurrentSyllabusWeek({
                      ...currentSyllabusWeek,
                      topics: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700"
                />
                <button
                  onClick={addSyllabusWeek}
                  className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium"
                >
                  + Add Module
                </button>
              </div>

              <div className="space-y-3">
                {formData.syllabus.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100"
                  >
                    <div>
                      <h4 className="font-bold text-[#0B2A4A] dark:text-gray-200">
                        {item.week}: {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {Array.isArray(item.topics)
                          ? item.topics.join(", ")
                          : item.topics}
                      </p>
                    </div>
                    <button
                      onClick={() => removeSyllabusWeek(index)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Outcomes & Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-[#0B2A4A] mb-3">
                  What will students learn?
                </h3>
                <div className="flex gap-2 mb-3">
                  <input
                    value={currentOutcome}
                    onChange={(e) => setCurrentOutcome(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border dark:bg-gray-700"
                    placeholder="Add outcome..."
                  />
                  <button
                    onClick={() =>
                      addListItem(
                        "learningOutcomes",
                        currentOutcome,
                        setCurrentOutcome,
                      )
                    }
                    className="p-2 bg-green-50 text-green-600 rounded-lg"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <ul className="space-y-2">
                  {formData.learningOutcomes.map((item, idx) => (
                    <li key={idx} className="flex gap-2 items-center text-sm">
                      <CheckCircle size={14} className="text-green-500" />
                      <span className="flex-1">{item}</span>
                      <button
                        onClick={() => removeListItem("learningOutcomes", idx)}
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-[#0B2A4A] mb-3">Requirements</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    value={currentRequirement}
                    onChange={(e) => setCurrentRequirement(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border dark:bg-gray-700"
                    placeholder="Add requirement..."
                  />
                  <button
                    onClick={() =>
                      addListItem(
                        "requirements",
                        currentRequirement,
                        setCurrentRequirement,
                      )
                    }
                    className="p-2 bg-orange-50 text-orange-600 rounded-lg"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <ul className="space-y-2">
                  {formData.requirements.map((item, idx) => (
                    <li key={idx} className="flex gap-2 items-center text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      <span className="flex-1">{item}</span>
                      <button
                        onClick={() => removeListItem("requirements", idx)}
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Settings */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#0B2A4A]">Publishing</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isDraft"
                    checked={formData.isDraft}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#D6A419]"
                  />
                  <label className="text-sm font-medium">Save as Draft</label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Category
                  </label>
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Duration
                  </label>
                  <input
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-[#0B2A4A] mb-4 flex items-center gap-2">
                <DollarSign size={20} /> Pricing
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Regular Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Sale Price (₹)
                  </label>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 font-mono text-green-600 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-[#0B2A4A] mb-4 flex items-center gap-2">
                <ImageIcon size={20} /> Course Media
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Thumbnail
                  </label>
                  <DropzoneArea
                    onDrop={(files) => handleImageUpload(files, "image")}
                    files={[]}
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mt-2 rounded-lg w-full h-32 object-cover"
                    />
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Instructor Image
                  </label>
                  <DropzoneArea
                    onDrop={(files) =>
                      handleImageUpload(files, "instructor.image")
                    }
                    files={[]}
                  />
                  {formData.instructor.image && (
                    <img
                      src={formData.instructor.image}
                      alt="Instructor"
                      className="mt-2 rounded-lg w-16 h-16 object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-[#0B2A4A] mb-4 flex items-center gap-2">
                <Globe size={20} /> SEO Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    URL Slug
                  </label>
                  <input
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 text-sm text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Meta Title
                  </label>
                  <input
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
