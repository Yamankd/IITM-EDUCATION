import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Moon,
  Sun,
  ShieldCheck,
} from "lucide-react";

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth-check");
        navigate("/AdminDashboard", { replace: true });
      } catch (error) {
        // Stay on login
      }
    };
    checkAuth();

    if (document.documentElement.classList.contains("dark")) {
      setIsDarkMode(true);
    }
  }, [navigate]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.general) {
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setErrors({ general: "Please fill in all required fields." });
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/admin-login", {
        email: formData.username,
        password: formData.password,
      });
      navigate("/AdminDashboard", { replace: true });
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message || "Invalid credentials provided.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans relative">
      {/* Back Button - Top Left */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 p-2 rounded-full bg-white dark:bg-slate-900 shadow-md text-slate-600 dark:text-slate-300 hover:text-[#D6A419] dark:hover:text-[#D6A419] transition-colors border border-slate-200 dark:border-slate-800 z-50 flex items-center gap-2 px-4 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      {/* Main Container - Borderless/Shadowless as requested previously */}
      <div className="w-full max-w-md p-8 relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 rounded-xl bg-[#0B2A4A] mb-6 shadow-lg shadow-[#0B2A4A]/20 transform hover:scale-105 transition-transform duration-300">
            <ShieldCheck className="text-[#D6A419] w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-[#0B2A4A] dark:text-white mb-2">
            Admin Portal
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Secure gateway for institute administrators.
          </p>
        </div>

        {/* Error Notification */}
        {errors.general && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r text-sm text-red-700 dark:text-red-300 animate-fade-in shadow-sm">
            <p className="font-bold">Authentication Failed</p>
            <p>{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div className="relative group">
            <label
              htmlFor="username"
              className="block text-sm font-bold text-[#0B2A4A] dark:text-slate-300 mb-2"
            >
              Email Address / Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              disabled={isLoading}
              value={formData.username}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3.5 text-slate-900 dark:text-white bg-white dark:bg-slate-900 border-2 ${errors.username ? "border-red-500" : "border-slate-200 dark:border-slate-700"} rounded-xl focus:ring-0 focus:border-[#D6A419] transition-all outline-none shadow-sm placeholder-slate-400`}
              placeholder="admin@institute.com"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-bold text-[#0B2A4A] dark:text-slate-300"
              >
                Password
              </label>
              <a
                href="#"
                className="text-sm font-semibold text-[#D6A419] hover:text-amber-600 transition-colors hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                value={formData.password}
                onChange={handleInputChange}
                className={`block w-full px-4 py-3.5 text-slate-900 dark:text-white bg-white dark:bg-slate-900 border-2 ${errors.password ? "border-red-500" : "border-slate-200 dark:border-slate-700"} rounded-xl focus:ring-0 focus:border-[#D6A419] transition-all outline-none shadow-sm placeholder-slate-400 pr-12`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0B2A4A] dark:hover:text-[#D6A419] transition-colors"
                tabIndex="-1"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-5 w-5 text-[#0B2A4A] focus:ring-[#D6A419] border-slate-300 rounded dark:bg-slate-800 dark:border-slate-600 transition-colors cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-3 block text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              Keep me logged in
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg shadow-[#0B2A4A]/20 text-base font-bold text-white bg-[#0B2A4A] hover:bg-[#1a4c7c] focus:outline-none focus:ring-4 focus:ring-[#0B2A4A]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              <>
                Sign In to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Area */}
        <div className="pt-8 mt-10 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-wider">
            © {new Date().getFullYear()} Digital IITM
          </p>
          <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center p-2.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold gap-2 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" /> Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#0B2A4A]" /> Dark Mode
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
