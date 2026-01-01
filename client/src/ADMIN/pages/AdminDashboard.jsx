import React, { useState } from "react";
import {
  BarChart3,
  Users,
  BookOpen,
  Calendar,
  Bell,
  Search,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
  LogOut,
  Settings,
  FileText,
  DollarSign,
  GraduationCap,
  Clock,
} from "lucide-react";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <Dashboard
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        darkMode={darkMode}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Content based on activeTab */}
            {activeTab === "overview" && <Overview />}
            {activeTab === "students" && <Students />}
            {activeTab === "courses" && <Courses />}
            {activeTab === "calendar" && <CalendarView />}
            {activeTab === "reports" && <Reports />}
          </div>
        </main>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, darkMode }) => {
  const navItems = [
    { id: "overview", icon: <BarChart3 size={20} />, label: "Overview" },
    { id: "students", icon: <Users size={20} />, label: "Students" },
    { id: "courses", icon: <BookOpen size={20} />, label: "Courses" },
    { id: "calendar", icon: <Calendar size={20} />, label: "Calendar" },
    { id: "finance", icon: <DollarSign size={20} />, label: "Finance" },
    { id: "reports", icon: <FileText size={20} />, label: "Reports" },
    { id: "settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 transform transition-transform duration-300 ease-in-out
        ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
        border-r flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div
          className={`p-6 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">EduAdmin</h1>
              <p className="text-sm opacity-75">Education Institute</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                transition-all duration-200 hover:scale-[1.02]
                ${
                  activeTab === item.id
                    ? darkMode
                      ? "bg-blue-900/30 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                    : darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div
          className={`p-4 border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
              alt="Admin"
              className="w-10 h-10 rounded-full border-2 border-blue-500"
            />
            <div className="flex-1">
              <p className="font-semibold">Dr. Sarah Johnson</p>
              <p className="text-sm opacity-75">Administrator</p>
            </div>
            <button className="p-2 hover:bg-gray-700 rounded-lg">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

// Header Component
const Header = ({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) => {
  return (
    <header
      className={`sticky top-0 z-10 ${
        darkMode ? "bg-gray-800" : "bg-white"
      } border-b px-4 md:px-6 py-4`}
    >
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="search"
              placeholder="Search students, courses, reports..."
              className={`pl-10 pr-4 py-2 rounded-lg w-64 md:w-96 
                ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Quick Actions */}
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
            Quick Action
            <ChevronDown className="inline ml-2" size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

// Overview Component
const Overview = () => {
  const stats = [
    {
      label: "Total Students",
      value: "2,847",
      change: "+12%",
      icon: <Users />,
      color: "blue",
    },
    {
      label: "Active Courses",
      value: "48",
      change: "+5%",
      icon: <BookOpen />,
      color: "green",
    },
    {
      label: "Faculty Members",
      value: "124",
      change: "+8%",
      icon: <GraduationCap />,
      color: "purple",
    },
    {
      label: "Pending Requests",
      value: "23",
      change: "-3%",
      icon: <Clock />,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, Dr. Johnson! 👋
        </h1>
        <p className="opacity-90">
          Here's what's happening with your institute today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}
              >
                <div
                  className={`text-${stat.color}-600 dark:text-${stat.color}-400`}
                >
                  {stat.icon}
                </div>
              </div>
              <div
                className={`flex items-center ${
                  stat.change.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {stat.change.startsWith("+") ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span className="ml-1 text-sm font-medium">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrollment Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6">Student Enrollment Trend</h2>
          <div className="h-64 flex items-end space-x-2">
            {[65, 80, 75, 90, 85, 95, 100].map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all duration-500 hover:opacity-80"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              {
                user: "Alex Johnson",
                action: "enrolled in",
                course: "Advanced Physics",
                time: "2 min ago",
              },
              {
                user: "Maria Garcia",
                action: "completed",
                course: "Calculus 101",
                time: "15 min ago",
              },
              {
                user: "Dr. Smith",
                action: "uploaded",
                course: "Chemistry Materials",
                time: "1 hour ago",
              },
              {
                user: "Student Council",
                action: "scheduled",
                course: "Annual Fest",
                time: "2 hours ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-gray-500">
                    {activity.action}{" "}
                    <span className="font-medium">{activity.course}</span>
                  </p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Add New Student", icon: "👨‍🎓", color: "blue" },
            { label: "Create Course", icon: "📚", color: "green" },
            { label: "Schedule Event", icon: "📅", color: "purple" },
            { label: "Generate Report", icon: "📊", color: "orange" },
          ].map((action, index) => (
            <button
              key={index}
              className={`p-6 rounded-xl bg-gradient-to-br from-${action.color}-50 to-white dark:from-gray-700 dark:to-gray-800 border border-${action.color}-100 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-105`}
            >
              <div className={`text-3xl mb-3`}>{action.icon}</div>
              <p className="font-medium">{action.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Students Component
const Students = () => {
  const students = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@edu.com",
      course: "Physics",
      grade: "A",
      status: "Active",
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria@edu.com",
      course: "Mathematics",
      grade: "A+",
      status: "Active",
    },
    {
      id: 3,
      name: "John Smith",
      email: "john@edu.com",
      course: "Chemistry",
      grade: "B+",
      status: "Pending",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@edu.com",
      course: "Biology",
      grade: "A",
      status: "Active",
    },
    {
      id: 5,
      name: "Mike Brown",
      email: "mike@edu.com",
      course: "Computer Science",
      grade: "A-",
      status: "Inactive",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add New Student
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th className="text-left p-4">Student</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Course</th>
                <th className="text-left p-4">Grade</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  className={`border-t ${
                    darkMode ? "border-gray-700" : "border-gray-100"
                  } hover:${
                    darkMode ? "bg-gray-700" : "bg-gray-50"
                  } transition-colors`}
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                        alt={student.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </td>
                  <td className="p-4">{student.email}</td>
                  <td className="p-4">{student.course}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        student.grade.includes("A")
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {student.grade}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        student.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : student.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded hover:opacity-80">
                      View
                    </button>
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

// Courses Component
const Courses = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Course Management</h1>
      {/* Similar structure to Students component */}
    </div>
  );
};

// Calendar Component
const CalendarView = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Academic Calendar</h1>
      {/* Calendar implementation */}
    </div>
  );
};

// Reports Component
const Reports = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>
      {/* Reports implementation */}
    </div>
  );
};

export default AdminDashboard;
