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
} from "lucide-react";
import { Reorder } from "framer-motion";

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
    navigate("/admin/loginpage", { replace: true });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Content Renderer
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
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

const SettingsView = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Settings
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6 transition-all">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Preferences
        </h3>
        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Dark Mode
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle dark theme for the dashboard
              </p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${darkMode ? "bg-blue-600" : "bg-gray-200"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${darkMode ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>
      </div>
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
    <div className="max-w-3xl space-y-6">
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

const CoursesView = () => <></>;

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
