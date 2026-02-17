import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logo.png";
import {
  CheckCircle,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Calendar,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  ChevronLeft,
} from "lucide-react";

const CertificationRegister = () => {
  const navigate = useNavigate();
  // 1: Email, 2: OTP, 3: Personal, 4: Academic, 5: Location, 6: Security
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form States
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [details, setDetails] = useState({
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    college: "",
    address: "",
    city: "",
    state: "",
    qualification: "",
    passingYear: "",
    dob: "",
    gender: "",
  });

  // Validation States
  const [errors, setErrors] = useState({});

  // Real-time Validation
  useEffect(() => {
    const newErrors = {};
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (details.mobile && !/^\d{10}$/.test(details.mobile)) {
      newErrors.mobile = "Mobile must be 10 digits";
    }
    if (details.password && details.password.length < 6) {
      newErrors.password = "Password must be at least 6 chars";
    }
    if (
      details.confirmPassword &&
      details.password !== details.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
  }, [email, details]);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (errors.email) return toast.error(errors.email);

    setLoading(true);
    try {
      const { data } = await api.post("/external/auth/send-otp", { email });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      // toast.error(error.response?.data?.message || "Failed to send OTP");
      // For demo purposes if backend fails, still allow showing UI - Remove in prod
      toast.error(error.response?.data?.message || "Failed to send OTP");
      //  setStep(2); // Remove this line if you want strict backend check
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("OTP must be 6 digits");

    setLoading(true);
    try {
      await api.post("/external/auth/verify-otp", { email, otp });
      toast.success("Email verified successfully!");
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
      // setStep(3); // Remove this line if you want strict backend check
    } finally {
      setLoading(false);
    }
  };

  // Step 6: Final Register
  const handleRegister = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email,
        name: details.name,
        mobile: details.mobile,
        dob: details.dob,
        gender: details.gender,
        password: details.password,
        certificationDetails: {
          college: details.college,
          address: details.address,
          city: details.city,
          state: details.state,
          qualification: details.qualification,
          passingYear: details.passingYear,
        },
      };

      const { data } = await api.post("/external/auth/register", payload);

      // Login user (save token)
      localStorage.setItem("studentToken", data.token);
      localStorage.setItem("studentInfo", JSON.stringify(data.user));

      toast.success("Registration Successful!");

      setTimeout(() => {
        navigate("/certification/dashboard");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const getInputBorderClass = (fieldName, value) => {
    if (errors[fieldName])
      return "border-red-500 focus:ring-red-200 focus:border-red-500";
    if (value && !errors[fieldName])
      return "border-green-500 focus:ring-green-200 focus:border-green-500";
    return "border-gray-200 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]";
  };

  const nextStep = () => {
    // Validation Logic
    if (step === 3) {
      // Personal
      if (!details.name || !details.mobile || !details.dob || !details.gender)
        return toast.error("Please fill all personal details");
      if (errors.mobile) return toast.error(errors.mobile);
    }
    if (step === 4) {
      // Academic
      if (!details.college || !details.qualification || !details.passingYear)
        return toast.error("Please fill all academic details");
    }
    if (step === 5) {
      // Location
      if (!details.address || !details.city || !details.state)
        return toast.error("Please fill all address details");
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

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
            Unlock Your <span className="text-[#D6A419]">Potential</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed opacity-90">
            Get certified by India's leading computer education network.
          </p>
        </div>

        {/* Unified Sidebar Progress */}
        <div className="relative z-10 my-12 hidden md:block">
          <div className="space-y-6">
            {/* Group 1: Identity */}
            <div
              className={`flex items-center gap-4 transition-all duration-300 ${step >= 1 ? "opacity-100" : "opacity-50"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? "bg-[#D6A419] border-[#D6A419] text-[#0B2A4A]" : "border-blue-300 text-blue-200"}`}
              >
                {step > 2 ? <CheckCircle size={20} /> : "1"}
              </div>
              <div>
                <h4 className="font-bold text-lg">Identity Verification</h4>
                <p className="text-xs text-blue-200">Email & OTP</p>
              </div>
            </div>

            {/* Group 2: Personal Profile */}
            <div
              className={`flex items-center gap-4 transition-all duration-300 ${step >= 3 ? "opacity-100" : "opacity-50"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 3 ? "bg-[#D6A419] border-[#D6A419] text-[#0B2A4A]" : "border-blue-300 text-blue-200"}`}
              >
                {step > 5 ? <CheckCircle size={20} /> : "2"}
              </div>
              <div>
                <h4 className="font-bold text-lg">Personal Profile</h4>
                <p className="text-xs text-blue-200">
                  Bio, Academic & Location
                </p>
              </div>
            </div>

            {/* Group 3: Security */}
            <div
              className={`flex items-center gap-4 transition-all duration-300 ${step >= 6 ? "opacity-100" : "opacity-50"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 6 ? "bg-[#D6A419] border-[#D6A419] text-[#0B2A4A]" : "border-blue-300 text-blue-200"}`}
              >
                {step > 6 ? <CheckCircle size={20} /> : "3"}
              </div>
              <div>
                <h4 className="font-bold text-lg">Account Security</h4>
                <p className="text-xs text-blue-200">Set Password</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-blue-200/60 font-medium">
          &copy; {new Date().getFullYear()} IITM Computer Education.
        </div>
      </div>

      {/* Right Panel: Content */}
      <div className="md:w-7/12 lg:w-8/12 bg-white flex flex-col justify-center p-6 md:p-16 lg:p-24 h-full overflow-y-auto w-full relative">
        <div className="max-w-2xl mx-auto w-full flex flex-col h-full justify-center">
          {/* Back Button (Global) */}
          {step > 1 && (
            <button
              onClick={prevStep}
              className="absolute top-8 left-8 text-gray-400 hover:text-[#0B2A4A] flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}

          {/* Progress Bar (Mobile) */}
          <div className="flex md:hidden justify-between mb-8">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 mx-0.5 rounded-full ${step >= s ? "bg-[#0B2A4A]" : "bg-gray-200"}`}
              ></div>
            ))}
          </div>

          {/* STEP 1: Email */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Get Started
                </h2>
                <p className="text-gray-500 text-lg">
                  Enter your email to being.
                </p>
              </div>
              <form onSubmit={handleSendOtp} className="space-y-8">
                <div className="relative group">
                  <Mail
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? "text-red-400" : "text-gray-400 group-focus-within:text-[#0B2A4A]"}`}
                    size={22}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-6 py-4 bg-gray-50 border rounded-xl outline-none transition-all text-lg ${getInputBorderClass("email", email)}`}
                    placeholder="student@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2 ml-1">
                    {errors.email}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || errors.email}
                  className="w-full bg-[#0B2A4A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0B2A4A]/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    "Send OTP"
                  )}
                  {!loading && <ArrowRight size={20} />}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Verify Email
                </h2>
                <p className="text-gray-500 text-lg">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-semibold text-[#0B2A4A]">{email}</span>
                </p>
              </div>
              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0B2A4A]"
                    size={22}
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] outline-none transition-all text-2xl tracking-[0.5em] font-mono text-center"
                    placeholder="••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-[#0B2A4A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0B2A4A]/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    "Verify & Continue"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: Personal Details */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Personal Details
              </h2>
              <p className="text-gray-500 mb-8">
                Tell us a bit about yourself.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={details.name}
                    onChange={handleChange}
                    autoFocus
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B2A4A]/10 focus:border-[#0B2A4A] outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      name="mobile"
                      value={details.mobile}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all ${getInputBorderClass("mobile", details.mobile)}`}
                      placeholder="9876543210"
                    />
                    {errors.mobile && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      name="dob"
                      value={details.dob}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B2A4A]/10 focus:border-[#0B2A4A] outline-none transition-all text-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  <div className="flex gap-4">
                    {["Male", "Female"].map((g) => (
                      <label
                        key={g}
                        className={`flex-1 flex items-center justify-center gap-2 cursor-pointer px-4 py-3 border rounded-xl transition-all ${details.gender === g ? "border-[#0B2A4A] bg-[#0B2A4A]/5 text-[#0B2A4A] font-bold" : "border-gray-200 bg-gray-50 text-gray-600"}`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={details.gender === g}
                          onChange={handleChange}
                          className="accent-[#0B2A4A] w-4 h-4"
                        />{" "}
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={nextStep}
                  className="bg-[#0B2A4A] text-white py-3 px-8 rounded-xl font-bold text-lg hover:bg-[#0B2A4A]/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  Next Step <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Academic Details */}
          {step === 4 && (
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Academic Info
              </h2>
              <p className="text-gray-500 mb-8">Your educational background.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    College / University
                  </label>
                  <input
                    type="text"
                    required
                    name="college"
                    value={details.college}
                    onChange={handleChange}
                    autoFocus
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B2A4A]/10 focus:border-[#0B2A4A] outline-none transition-all"
                    placeholder="Institute Name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Highest Qualification
                    </label>
                    <select
                      name="qualification"
                      required
                      value={details.qualification}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B2A4A]/10 focus:border-[#0B2A4A] outline-none transition-all appearance-none text-gray-600"
                    >
                      <option value="">Select Option</option>
                      {[
                        "High School",
                        "Diploma",
                        "Undergraduate",
                        "Postgraduate",
                        "PhD",
                      ].map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Passing Year
                    </label>
                    <input
                      type="number"
                      required
                      name="passingYear"
                      value={details.passingYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B2A4A]/10 focus:border-[#0B2A4A] outline-none transition-all"
                      placeholder="YYYY"
                      min="1900"
                      max="2099"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={nextStep}
                  className="bg-[#0B2A4A] text-white py-3 px-8 rounded-xl font-bold text-lg hover:bg-[#0B2A4A]/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  Next Step <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Location Details */}
          {step === 5 && (
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Location Details
              </h2>
              <p className="text-gray-500 mb-8">Where are you located?</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    name="address"
                    value={details.address}
                    onChange={handleChange}
                    autoFocus
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B2A4A]/10 focus:border-[#0B2A4A] outline-none transition-all"
                    placeholder="Full Address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City / District
                    </label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={details.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B2A4A]/10 focus:border-[#0B2A4A] outline-none transition-all"
                      placeholder="New Delhi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State / Province
                    </label>
                    <input
                      type="text"
                      required
                      name="state"
                      value={details.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B2A4A]/10 focus:border-[#0B2A4A] outline-none transition-all"
                      placeholder="Delhi"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={nextStep}
                  className="bg-[#0B2A4A] text-white py-3 px-8 rounded-xl font-bold text-lg hover:bg-[#0B2A4A]/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  Next Step <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Security & Submit */}
          {step === 6 && (
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Account Security
              </h2>
              <p className="text-gray-500 mb-8">
                Set a strong password for your account.
              </p>

              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      name="password"
                      value={details.password}
                      onChange={handleChange}
                      autoFocus
                      className={`w-full pl-4 pr-12 py-3 bg-white border rounded-xl outline-none transition-all ${getInputBorderClass("password", details.password)}`}
                      placeholder="Min 6 chars"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B2A4A] p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      name="confirmPassword"
                      value={details.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-4 pr-12 py-3 bg-white border rounded-xl outline-none transition-all ${getInputBorderClass("confirmPassword", details.confirmPassword)}`}
                      placeholder="Re-enter password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B2A4A] p-1"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={loading || Object.keys(errors).length > 0}
                    className="w-full bg-[#0B2A4A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0B2A4A]/90 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg shadow-blue-900/10"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      "Complete Registration"
                    )}
                    {!loading && <CheckCircle size={20} />}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificationRegister;
