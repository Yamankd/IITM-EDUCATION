import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import {
  Users,
  BookOpen,
  LayoutDashboard,
  Settings,
  Menu,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  Image as ImageIcon,
  HelpCircle,
  Moon,
  Sun,
  Plus,
  Trash2,
  GripVertical,
  Edit2,
  X,
  MessageSquare,
} from "lucide-react";
import { Reorder } from "framer-motion";
import LeadsView from "./LeadsView";

// Main Component
const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Initialize dark mode from localStorage if available
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const navigate = useNavigate();

  // 1. FIX: Apply Dark Mode to the HTML root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // 2. FIX: Logout Functionality (Cookie + LocalStorage)
  const handleLogout = async () => {
    try {
      await api.post("/admin-logout");
    } catch (error) {
      console.error("Logout failed", error);
    }

    // Clear Local Storage
    localStorage.removeItem("adminToken");
    localStorage.removeItem("theme");

    // Redirect
    navigate("/admin-login", { replace: true });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Content Renderer
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "leads":
        return <LeadsView />;
      case "students":
        return (
          <Placeholder title="Students Management" icon={<Users size={48} />} />
        );
      case "courses":
        return <CoursesView />;
      case "gallery":
        return <GalleryView />;
      case "faq":
        return <FAQView />;
      case "settings":
        return (
          <SettingsView darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        );
      default:
        return <Overview />;
    }
  };

  return (
    // Removed the outer 'dark' class conditional here, relying on document.documentElement instead
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          darkMode={darkMode}
        />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ isOpen, setIsOpen, activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "leads", label: "Leads", icon: <MessageSquare size={20} /> },
    { id: "students", label: "Students", icon: <Users size={20} /> },
    { id: "courses", label: "Courses", icon: <BookOpen size={20} /> },
    { id: "gallery", label: "Gallery", icon: <ImageIcon size={20} /> },
    { id: "faq", label: "FAQ", icon: <HelpCircle size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden ${isOpen ? "block" : "hidden"}`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-30 
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-all duration-300 ease-in-out
        ${/* Sidebar Logic: Full width on mobile/open, Mini width on desktop/closed */ ""}
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"}
      `}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="font-bold text-xl text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
              DI
            </div>
            <span
              className={`${isOpen ? "block" : "hidden"} transition-all duration-200 whitespace-nowrap`}
            >
              DIGITAL IITM
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group relative
                ${
                  activeTab === item.id
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                }
              `}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <span
                className={`whitespace-nowrap ${isOpen ? "block" : "hidden"}`}
              >
                {item.label}
              </span>
              {!isOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-md">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Footer (Logout) */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors w-full px-3 py-2 group relative"
          >
            <div className="flex-shrink-0">
              <LogOut size={20} />
            </div>
            <span className={`${isOpen ? "block" : "hidden"}`}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// Header Component
const Header = ({ toggleSidebar, darkMode }) => (
  <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-300">
    <div className="flex items-center gap-4">
      {/* 3. FIX: Removed lg:hidden so button appears on Desktop too */}
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
      >
        <Menu size={20} />
      </button>
    </div>

    <div className="flex items-center gap-4">
      <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center font-bold shadow-sm">
        A
      </div>
    </div>
  </header>
);

// --- Sub-Components (Unchanged content, kept for completeness) ---

const Overview = () => {
  return <></>;
};

const CoursesView = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    level: "Beginner",
    duration: "",
    price: 0,
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
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await api.delete(`/courses/${id}`);
        setCourses(courses.filter((c) => c._id !== id));
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        const { data } = await api.put(
          `/courses/${editingCourse._id}`,
          formData,
        );
        setCourses(
          courses.map((c) => (c._id === editingCourse._id ? data.course : c)),
        );
      } else {
        const { data } = await api.post("/courses", formData);
        setCourses([data.course, ...courses]);
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const resetForm = () => {
    setEditingCourse(null);
    setFormData({
      title: "",
      category: "",
      level: "Beginner",
      duration: "",
      price: 0,
      description: "",
      longDescription: "",
      image: "",
      instructor: { name: "", bio: "", image: "" },
      learningOutcomes: [],
      requirements: [],
      syllabus: [],
    });
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData(course);
    setShowModal(true);
  };

  const addListItem = (field, value, updateFn) => {
    if (value.trim()) {
      setFormData({ ...formData, [field]: [...formData[field], value] });
      updateFn("");
    }
  };

  const removeListItem = (field, index) => {
    const newList = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newList });
  };

  const addSyllabusWeek = () => {
    if (currentSyllabusWeek.week && currentSyllabusWeek.title) {
      const topicsArray = currentSyllabusWeek.topics
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      setFormData({
        ...formData,
        syllabus: [
          ...formData.syllabus,
          { ...currentSyllabusWeek, topics: topicsArray },
        ],
      });
      setCurrentSyllabusWeek({ week: "", title: "", topics: "" });
    }
  };

  const removeSyllabusWeek = (index) => {
    const newSyllabus = formData.syllabus.filter((_, i) => i !== index);
    setFormData({ ...formData, syllabus: newSyllabus });
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-[#0B2A4A] dark:text-white">
            Courses Manager
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage educational courses
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
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
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col"
            >
              <img
                src={course.image || "https://via.placeholder.com/300"}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {course.category}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                    {course.level}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0B2A4A] dark:text-white mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="font-bold text-[#D6A419]">
                    ₹{course.price}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl my-8 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h3 className="text-xl font-bold text-[#0B2A4A] dark:text-white">
                {editingCourse ? "Edit Course" : "Add New Course"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                      Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 12 Weeks"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Long Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.longDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        longDescription: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Instructor */}
                <div className="border-t pt-4 dark:border-gray-700">
                  <h4 className="font-semibold mb-3 dark:text-white">
                    Instructor Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.instructor.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instructor: {
                            ...formData.instructor,
                            name: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Bio"
                      value={formData.instructor.bio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instructor: {
                            ...formData.instructor,
                            bio: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={formData.instructor.image}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instructor: {
                            ...formData.instructor,
                            image: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                {/* Dynamic Lists: Learning Outcomes */}
                <div className="border-t pt-4 dark:border-gray-700">
                  <h4 className="font-semibold mb-3 dark:text-white">
                    Learning Outcomes
                  </h4>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={currentOutcome}
                      onChange={(e) => setCurrentOutcome(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Add outcome..."
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addListItem(
                          "learningOutcomes",
                          currentOutcome,
                          setCurrentOutcome,
                        )
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    {formData.learningOutcomes.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm dark:text-gray-300 flex justify-between items-center group"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeListItem("learningOutcomes", i)}
                          className="text-red-500 opacity-0 group-hover:opacity-100"
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dynamic Lists: Requirements */}
                <div>
                  <h4 className="font-semibold mb-3 dark:text-white">
                    Requirements
                  </h4>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={currentRequirement}
                      onChange={(e) => setCurrentRequirement(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Add requirement..."
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addListItem(
                          "requirements",
                          currentRequirement,
                          setCurrentRequirement,
                        )
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    {formData.requirements.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm dark:text-gray-300 flex justify-between items-center group"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeListItem("requirements", i)}
                          className="text-red-500 opacity-0 group-hover:opacity-100"
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Syllabus */}
                <div className="border-t pt-4 dark:border-gray-700">
                  <h4 className="font-semibold mb-3 dark:text-white">
                    Syllabus
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Week (e.g. 1)"
                      value={currentSyllabusWeek.week}
                      onChange={(e) =>
                        setCurrentSyllabusWeek({
                          ...currentSyllabusWeek,
                          week: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Title"
                      value={currentSyllabusWeek.title}
                      onChange={(e) =>
                        setCurrentSyllabusWeek({
                          ...currentSyllabusWeek,
                          title: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Topics (comma separated)"
                      value={currentSyllabusWeek.topics}
                      onChange={(e) =>
                        setCurrentSyllabusWeek({
                          ...currentSyllabusWeek,
                          topics: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSyllabusWeek}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg mb-4"
                  >
                    Add Week
                  </button>

                  <div className="space-y-2">
                    {formData.syllabus.map((week, i) => (
                      <div
                        key={i}
                        className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 flex justify-between items-start"
                      >
                        <div>
                          <span className="font-bold block text-sm">
                            Week {week.week}: {week.title}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {week.topics.join(", ")}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSyllabusWeek(i)}
                          className="text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#D6A419] text-white rounded-lg hover:bg-yellow-500 font-medium"
                  >
                    Save Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GalleryView = () => <></>;

const FAQView = () => {
  const [faqs, setFaqs] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const fetchFaqs = async () => {
    try {
      const response = await api.get("/faqs");
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs", error);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await api.delete(`/faqs/${id}`);
      fetchFaqs(); // Refresh list
    } catch (error) {
      console.error("Error deleting FAQ", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/faqs", { question: newQuestion, answer: newAnswer });
      setShowAddForm(false);
      setNewQuestion("");
      setNewAnswer("");
      fetchFaqs();
    } catch (error) {
      console.error("Error creating FAQ", error);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          FAQ Manager
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          {showAddForm ? (
            "Cancel"
          ) : (
            <>
              <Plus size={16} /> Add Question
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4"
        >
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Add New Question
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question
            </label>
            <input
              type="text"
              required
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., How do I reset my password?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Answer
            </label>
            <textarea
              required
              rows={3}
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter the answer here..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            Save FAQ
          </button>
        </form>
      )}

      <Reorder.Group
        axis="y"
        values={faqs}
        onReorder={setFaqs}
        className="space-y-4"
      >
        {faqs.map((item) => (
          <Reorder.Item
            key={item._id}
            value={item}
            onDragEnd={async () => {
              // Determine new order based on current 'faqs' state
              const newOrder = faqs.map((f) => f._id);
              try {
                await api.put("/faqs/reorder", { order: newOrder });
              } catch (err) {
                console.error("Failed to save order", err);
              }
            }}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all flex items-start gap-3"
          >
            <div className="mt-1 text-gray-400 cursor-move hover:text-gray-600 dark:hover:text-gray-300">
              <GripVertical size={20} />
            </div>
            <div className="flex-1 flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {item.question}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.answer}
                </p>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1"
                title="Delete FAQ"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {faqs.length === 0 && !showAddForm && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No FAQs found. Add one to get started!
        </p>
      )}
    </div>
  );
};

const SettingsView = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm max-w-2xl">
      <h2 className="text-2xl font-bold text-[#0B2A4A] dark:text-white mb-6">
        Settings
      </h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-gray-600 rounded-lg shadow-sm">
              {darkMode ? <Moon size={24} /> : <Sun size={24} />}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Appearance
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Switch between light and dark themes
              </p>
            </div>
          </div>

          <button
            onClick={toggleDarkMode}
            className={`
              relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#D6A419] focus:ring-offset-2
              ${darkMode ? "bg-[#D6A419]" : "bg-gray-200"}
            `}
          >
            <span
              className={`
                inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                ${darkMode ? "translate-x-7" : "translate-x-1"}
              `}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

const Placeholder = ({ title, icon }) => (
  <div className="flex flex-col items-center justify-center h-96 text-gray-400 dark:text-gray-500">
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
      {title}
    </h3>
    <p>This section is under construction.</p>
  </div>
);

export default AdminDashboard;
