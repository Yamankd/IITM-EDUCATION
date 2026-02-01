import React, { useState, useEffect } from "react";
import api from "../../api/api";
import {
  Users,
  BookOpen,
  Search,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
} from "lucide-react";
import CourseEditor from "./CourseEditor";
import { useAlert } from "../../context/AlertContext";
import { useConfirm } from "../../components/ConfirmDialog";

const CoursesView = () => {
  const { showError } = useAlert();
  const { showConfirm } = useConfirm();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'editor'
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses");
      setCourses(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm({
      title: "Delete Course",
      message: "Are you sure you want to delete this course?",
      type: "danger",
      confirmText: "Delete",
    });

    if (isConfirmed) {
      try {
        await api.delete(`/courses/${id}`);
        setCourses(courses.filter((c) => c._id !== id));
      } catch (error) {
        console.error("Error deleting course:", error);
        showError("Failed to delete course");
      }
    }
  };

  const handleSaveCourse = async (courseData) => {
    try {
      let savedCourse;
      if (editingCourse) {
        const { data } = await api.put(
          `/courses/${editingCourse._id}`,
          courseData,
        );
        savedCourse = data.course;
        setCourses(
          courses.map((c) => (c._id === editingCourse._id ? savedCourse : c)),
        );
      } else {
        const { data } = await api.post("/courses", courseData);
        savedCourse = data.course;
        setCourses([savedCourse, ...courses]);
      }
      setViewMode("list");
      setEditingCourse(null);
    } catch (error) {
      console.error("Error saving course:", error);
      showError("Failed to save course");
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setViewMode("editor");
  };

  const handleCreate = () => {
    setEditingCourse(null);
    setViewMode("editor");
  };

  const handleCancel = () => {
    setViewMode("list");
    setEditingCourse(null);
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Return Editor if in editor mode
  if (viewMode === "editor") {
    return (
      <CourseEditor
        course={editingCourse}
        onSave={handleSaveCourse}
        onCancel={handleCancel}
      />
    );
  }

  // Return List View
  return (
    <div className="space-y-6">
      {/* Stats Logic */}
      <div className="hidden md:flex gap-4 mb-4">
        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm font-medium">
          Active Courses: {courses.filter((c) => !c.isDraft).length}
        </div>
        <div className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200 text-sm font-medium">
          Drafts: {courses.filter((c) => c.isDraft).length}
        </div>
      </div>

      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
        <div>
          <h2 className="text-2xl font-bold text-[#0B2A4A] dark:text-white">
            Courses Manager
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage educational courses
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-[#D6A419] text-white rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          Add Course
        </button>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search Courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#D6A419]/20 focus:border-[#D6A419] transition-all"
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D6A419]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image || "https://via.placeholder.com/300"}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {course.isDraft && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                      Draft
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                    {course.category}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                    {course.level}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0B2A4A] dark:text-white mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <div
                  className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: course.description || course.longDescription,
                  }}
                />
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="font-bold text-[#D6A419] text-lg">
                    ₹{course.salePrice > 0 ? course.salePrice : course.price}
                    {course.salePrice > 0 && (
                      <span className="text-gray-400 text-sm line-through ml-2 font-normal">
                        ₹{course.price}
                      </span>
                    )}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesView;
