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
} from "lucide-react";

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
    { id: "faq", label: "FAQ & Help", icon: <HelpCircle size={20} /> },
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
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20 lg:hover:w-64 group"}
      `}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="font-bold text-xl text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
              EA
            </div>
            <span
              className={`${isOpen ? "block" : "hidden lg:group-hover:block"} transition-all duration-200 whitespace-nowrap`}
            >
              EduAdmin
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
                w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors overflow-hidden
                ${
                  activeTab === item.id
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                }
              `}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <span
                className={`whitespace-nowrap ${isOpen ? "block" : "hidden lg:group-hover:block"}`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Footer (Logout) */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors w-full px-3 py-2 overflow-hidden"
          >
            <div className="flex-shrink-0">
              <LogOut size={20} />
            </div>
            <span
              className={`${isOpen ? "block" : "hidden lg:group-hover:block"}`}
            >
              Logout
            </span>
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

      {/* Simple Search */}
      <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 w-64 transition-colors">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full text-gray-700 dark:text-gray-200"
        />
      </div>
    </div>

    <div className="flex items-center gap-4">
      <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center font-bold shadow-sm">
        A
      </div>
    </div>
  </header>
);

// --- Sub-Components (Unchanged content, kept for completeness) ---

const Overview = () => {
  const stats = [
    {
      label: "Total Students",
      value: "2,847",
      change: "+12%",
      icon: <Users className="text-blue-500" />,
    },
    {
      label: "Active Courses",
      value: "48",
      change: "+5%",
      icon: <BookOpen className="text-purple-500" />,
    },
    {
      label: "Gallery Images",
      value: "156",
      change: "+24",
      icon: <ImageIcon className="text-pink-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {stat.icon}
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Recent Activities
          </h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {[1, 2, 3].map((item) => (
                <tr
                  key={item}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">Admin User</td>
                  <td className="px-6 py-4">Updated course material</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                      2 mins ago
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
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

const GalleryView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Gallery
      </h2>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
        <Plus size={16} /> Upload Image
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <div
          key={item}
          className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer group"
        >
          <ImageIcon
            className="text-gray-400 group-hover:text-blue-500 transition-colors"
            size={32}
          />
        </div>
      ))}
    </div>
  </div>
);

const FAQView = () => (
  <div className="max-w-3xl space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        FAQ Manager
      </h2>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
        <Plus size={16} /> Add Question
      </button>
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                How do I reset my password?
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Modified 2 days ago
              </p>
            </div>
            <button className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 p-1">
              <Settings size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CoursesView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Courses
      </h2>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
        <Plus size={16} /> New Course
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all"
        >
          <div className="h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <BookOpen className="text-gray-400 dark:text-gray-500" size={32} />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                Development
              </span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">
              Full Stack Web Dev
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Last updated 2 hours ago
            </p>
            <button className="w-full py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              Manage Content
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

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
