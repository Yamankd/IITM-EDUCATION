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
  Edit2,
  X,
  MessageSquare,
  Sparkles,
} from "lucide-react";

// Sub-view imports
import LeadsView from "./LeadsView";
import GalleryView from "./GalleryView";
import FAQView from "./FAQView";
import CoursesView from "./CoursesView";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // --- Dark Mode Logic ---
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // --- Logout Logic ---
  const handleLogout = async () => {
    try {
      await api.post("/admin-logout");
    } catch (error) {
      console.error("Logout failed", error);
    }
    localStorage.removeItem("adminToken");
    navigate("/admin-login", { replace: true });
  };

  // --- View Router ---
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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          darkMode={darkMode}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

// --- Sub-Components ---

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
      <div
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden ${isOpen ? "block" : "hidden"}`}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ${isOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-700">
          <div className="font-bold text-xl text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              DI
            </div>
            {isOpen && <span>DIGITAL IITM</span>}
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group relative ${activeTab === item.id ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
            >
              {item.icon}
              {isOpen && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 text-gray-500 hover:text-red-500 w-full px-3 py-2"
          >
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

const Header = ({ toggleSidebar }) => (
  <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-10">
    <button
      onClick={toggleSidebar}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
    >
      <Menu size={20} />
    </button>
    <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center font-bold">
      A
    </div>
  </header>
);

const SettingsView = ({ darkMode, toggleDarkMode }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm max-w-2xl">
    <h2 className="text-2xl font-bold mb-6">Settings</h2>
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
      <div className="flex items-center gap-4">
        {darkMode ? <Moon size={24} /> : <Sun size={24} />}
        <div>
          <h3 className="font-semibold">Appearance</h3>
          <p className="text-sm text-gray-500">
            Switch between light and dark themes
          </p>
        </div>
      </div>
      <button
        onClick={toggleDarkMode}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${darkMode ? "bg-blue-600" : "bg-gray-200"}`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${darkMode ? "translate-x-7" : "translate-x-1"}`}
        />
      </button>
    </div>
  </div>
);

const Overview = () => (
  <div className="p-10 text-center">
    Welcome to the Dashboard! Use the sidebar to navigate.
  </div>
);

const Placeholder = ({ title, icon }) => (
  <div className="flex flex-col items-center justify-center h-96 text-gray-400">
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p>This section is under construction.</p>
  </div>
);

export default AdminDashboard;
