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
  Plus,
  Trash2,
  Edit2,
  X,
  MessageSquare,
  Sparkles,
  Award,
  GraduationCap,
} from "lucide-react";

// Sub-view imports
// Sub-view imports
import LeadsView from "./LeadsView";
import GalleryView from "./GalleryView";
import FAQView from "./FAQView";
import CoursesView from "./CoursesView";
import InstructorsView from "../../components/admin/InstructorsView";
import SettingsView from "./SettingsView";
import StudentsView from "./StudentsView";
import ExamsView from "./ExamsView";
import CertificationManagement from "./CertificationManagement";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("adminActiveTab") || "overview";
  });
  const navigate = useNavigate();

  // Save activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

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
        return <StudentsView />;

      case "instructors":
        return <InstructorsView />;
      case "courses":
        return <CoursesView />;
      case "exams":
        return <ExamsView />;
      case "certifications":
        return <CertificationManagement />;
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
    { id: "students", label: "Students", icon: <GraduationCap size={20} /> },
    { id: "leads", label: "Leads", icon: <MessageSquare size={20} /> },

    { id: "instructors", label: "Instructors", icon: <Users size={20} /> },
    { id: "courses", label: "Courses", icon: <BookOpen size={20} /> },
    { id: "exams", label: "Exams", icon: <Award size={20} /> },
    {
      id: "certifications",
      label: "Certifications",
      icon: <Award size={20} />,
    }, // Added Certifications
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
          <div className="font-bold text-xl text-[#0B2A4A] dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0B2A4A] text-[#D6A419] rounded-lg flex items-center justify-center">
              DI
            </div>
            {isOpen && <span className="tracking-tight">DIGITAL IITM</span>}
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all group relative font-medium ${
                activeTab === item.id
                  ? "bg-[#0B2A4A] text-[#D6A419] shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:bg-[#D6A419]/10 hover:text-[#0B2A4A] dark:hover:text-[#D6A419]"
              }`}
            >
              <span className={activeTab === item.id ? "text-[#D6A419]" : ""}>
                {item.icon}
              </span>
              {isOpen && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 w-full px-3 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

const Header = ({ toggleSidebar }) => {
  const adminName = localStorage.getItem("adminName") || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-10">
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
      >
        <Menu size={20} />
      </button>
      <div className="w-8 h-8 bg-[#0B2A4A] rounded-full text-[#D6A419] flex items-center justify-center font-bold">
        {adminInitial}
      </div>
    </header>
  );
};

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
