import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import SEO from "../../components/common/SEO";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post("/students/login", { email, password });
      localStorage.setItem("studentToken", data.token);
      localStorage.setItem("studentInfo", JSON.stringify(data));
      navigate("/student/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B2A4A] font-sans relative overflow-hidden">
      <SEO
        title="Student Login"
        description="Login to the Student Portal to access your courses, view exam results, and manage your profile."
        keywords="student login, iitm student portal, student dashboard, education portal"
      />
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#fff] blur-[100px]" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md p-8 relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Student Portal</h1>
          <p className="text-sm text-slate-300 max-w-xs mx-auto">
            Access your courses, exams, and results.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r text-sm text-red-200 animate-fade-in shadow-sm">
            <p className="font-bold">Login Failed</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="relative group">
            <label
              htmlFor="email"
              className="block text-sm font-bold text-white mb-2"
            >
              Email Address / Username
            </label>
            <input
              id="email"
              type="email"
              placeholder="student@institute.com"
              className="block w-full px-4 py-3.5 text-white bg-white/10 border-2 border-white/10 rounded-xl focus:ring-0 focus:border-[#D6A419] transition-all outline-none shadow-sm placeholder-white/30 backdrop-blur-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-bold text-white"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="block w-full px-4 py-3.5 text-white bg-white/10 border-2 border-white/10 rounded-xl focus:ring-0 focus:border-[#D6A419] transition-all outline-none shadow-sm placeholder-white/30 pr-12 backdrop-blur-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#D6A419] transition-colors"
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

          {/* Remember Me Checkbox (Optional, keeping consistent layout) */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-5 w-5 text-[#D6A419] focus:ring-[#D6A419] border-white/30 bg-white/10 rounded transition-colors cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-3 block text-sm font-medium text-slate-300 cursor-pointer"
            >
              Keep me logged in
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg shadow-[#D6A419]/20 text-base font-bold text-[#0B2A4A] bg-[#D6A419] hover:bg-[#b88c12] focus:outline-none focus:ring-4 focus:ring-[#D6A419]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-[#0B2A4A]"
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
                Sign In to Student Portal
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Area */}
        <div className="pt-8 mt-10 border-t border-white/10 text-center">
          <p className="text-xs font-medium text-slate-400 mb-4 uppercase tracking-wider">
            © {new Date().getFullYear()} Digital IITM
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
