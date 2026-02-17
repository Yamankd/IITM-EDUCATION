import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logo.png";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  ChevronLeft,
} from "lucide-react";

const CertificationLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // UI States
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/external/auth/login", formData);

      // Save token and user info
      localStorage.setItem("studentToken", data.token);
      localStorage.setItem("studentInfo", JSON.stringify(data.user));

      toast.success("Login Successful!");

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/certification/dashboard");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Left Panel */}
      <div className="md:w-5/12 lg:w-4/12 bg-[#0B2A4A] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden shrink-0 md:h-full">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400 blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#D6A419] blur-[120px]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-2 rounded-lg shadow-lg">
              <img
                src={logo}
                alt="IITM Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-wide">
              IITM EDUCATION
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Welcome <span className="text-[#D6A419]">Back</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed opacity-90">
            Access your dashboard and continue your learning journey.
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* Home Button - Centered at Bottom */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-blue-200 hover:text-white font-semibold transition-colors group"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="md:w-7/12 lg:w-8/12 bg-white flex flex-col justify-center p-6 md:p-16 lg:p-24 h-full overflow-y-auto w-full relative">
        <div className="max-w-md mx-auto w-full flex flex-col h-full justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Student Login
            </h2>
            <p className="text-gray-500 text-lg">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0B2A4A]"
                size={22}
              />
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] outline-none transition-all text-lg"
                placeholder="student@example.com"
              />
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0B2A4A]"
                size={22}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] outline-none transition-all text-lg"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B2A4A] p-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-semibold text-[#0B2A4A] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B2A4A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0B2A4A]/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                "Login to Dashboard"
              )}
              {!loading && <ArrowRight size={20} />}
            </button>

            <div className="text-center mt-6 text-gray-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/certification/register")}
                className="font-bold text-[#0B2A4A] hover:underline"
              >
                Register here
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CertificationLogin;
