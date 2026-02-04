import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import {
  X,
  Lock,
  CheckCircle,
  Loader2,
  MapPin,
  Book,
  Users,
  Monitor,
} from "lucide-react";
import { useAlert } from "../context/AlertContext";
import { Helmet } from "react-helmet-async";

const CourseDetail = () => {
  const { id } = useParams();
  const { showError, showInfo } = useAlert();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Lead Generation State
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadFormData, setLeadFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const copyCourseLink = () => {
    const courseUrl = window.location.href;
    navigator.clipboard
      .writeText(courseUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // --- LEAD GENERATION LOGIC ---
  const handleTabClick = (tab) => {
    if (tab === "syllabus") {
      const isLeadCaptured = localStorage.getItem("leadCaptured");

      if (!isLeadCaptured) {
        setShowLeadModal(true);
        return;
      }
    }
    setActiveTab(tab);
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setSubmittingLead(true);

    try {
      await api.post("/leads", {
        ...leadFormData,
        courseId: id,
        courseTitle: course.title,
      });

      localStorage.setItem("leadCaptured", "true");
      setShowLeadModal(false);
      setActiveTab("syllabus");
    } catch (error) {
      console.error("Error submitting lead:", error);
      showError("Something went wrong. Please try again.");
    } finally {
      setSubmittingLead(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D6A419] mb-4"></div>
          <p className="text-[#0B2A4A] font-medium animate-pulse">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl p-10">
            <h1 className="text-3xl font-bold text-[#0B2A4A] mb-4">
              Course Not Found
            </h1>
            <Link
              to="/course"
              className="inline-flex px-8 py-3 bg-[#D6A419] text-white font-bold rounded-xl hover:bg-yellow-500 transition-all"
            >
              Browse All Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 font-sans relative">
      <Helmet>
        <title>{course.metaTitle || course.title} | Digital IITM</title>
        <meta
          name="description"
          content={course.metaDescription || course.description}
        />
        <meta
          name="keywords"
          content={
            course.category
              ? `${course.category}, course, learning`
              : "course, learning"
          }
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={course.metaTitle || course.title} />
        <meta
          property="og:description"
          content={course.metaDescription || course.description}
        />
        <meta property="og:image" content={course.image} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta
          property="twitter:title"
          content={course.metaTitle || course.title}
        />
        <meta
          property="twitter:description"
          content={course.metaDescription || course.description}
        />
        <meta property="twitter:image" content={course.image} />
      </Helmet>
      {/* --- LEAD CAPTURE MODAL --- */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="bg-[#0B2A4A] p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-[#D6A419] rounded-full opacity-20"></div>

              <button
                onClick={() => setShowLeadModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Lock className="text-[#D6A419]" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                Unlock Syllabus
              </h3>
              <p className="text-blue-100 text-sm">
                Fill in your details to view the full curriculum.
              </p>
            </div>

            <div className="p-8">
              <form onSubmit={handleLeadSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#D6A419] focus:border-transparent outline-none transition-all"
                      value={leadFormData.name}
                      onChange={(e) =>
                        setLeadFormData({
                          ...leadFormData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#D6A419] focus:border-transparent outline-none transition-all"
                      value={leadFormData.email}
                      onChange={(e) =>
                        setLeadFormData({
                          ...leadFormData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#D6A419] focus:border-transparent outline-none transition-all"
                      value={leadFormData.phone}
                      onChange={(e) =>
                        setLeadFormData({
                          ...leadFormData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your City / Address"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#D6A419] focus:border-transparent outline-none transition-all"
                      value={leadFormData.address}
                      onChange={(e) =>
                        setLeadFormData({
                          ...leadFormData,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    placeholder="Any specific questions?"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#D6A419] focus:border-transparent outline-none transition-all h-20 resize-none"
                    value={leadFormData.message}
                    onChange={(e) =>
                      setLeadFormData({
                        ...leadFormData,
                        message: e.target.value,
                      })
                    }
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingLead}
                  className="w-full py-3.5 bg-[#D6A419] text-white font-bold rounded-xl hover:bg-yellow-500 shadow-lg shadow-yellow-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submittingLead ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />{" "}
                      Unlocking...
                    </>
                  ) : (
                    "Unlock Content"
                  )}
                </button>
                <p className="text-xs text-center text-gray-400 mt-4">
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm font-medium" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-[#0B2A4A] transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center text-gray-300">
              <svg
                className="w-4 h-4 mx-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              <Link
                to="/course"
                className="text-gray-400 hover:text-[#0B2A4A] transition-colors"
              >
                Courses
              </Link>
            </li>
            <li className="flex items-center text-gray-300">
              <svg
                className="w-4 h-4 mx-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              <span className="text-[#0B2A4A] line-clamp-1">
                {course.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="relative h-64 md:h-80 w-full group">
                <img
                  src={course.image || "https://via.placeholder.com/800x400"}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 bg-[#D6A419] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm mb-3 inline-block">
                    {course.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight drop-shadow-md">
                    {course.title}
                  </h1>
                </div>
              </div>

              <div className="p-8">
                {/* Metadata Row */}
                <div className="flex flex-wrap items-center justify-between mb-8 gap-4 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        course.level === "Beginner"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : course.level === "Intermediate"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : "bg-purple-50 text-purple-700 border border-purple-100"
                      }`}
                    >
                      {course.level}
                    </span>
                  </div>
                  <button
                    onClick={copyCourseLink}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-[#0B2A4A] hover:bg-gray-50 transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        ></path>
                      </svg>
                    )}
                    {copied ? "Link Copied!" : "Share"}
                  </button>
                </div>

                <div
                  className="prose prose-lg max-w-none text-gray-600 mb-8 text-justify"
                  dangerouslySetInnerHTML={{
                    __html: course.longDescription || course.description,
                  }}
                />

                {/* Rating Box */}
                <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-[#0B2A4A] mr-2">
                      {course.rating || 4.5}
                    </span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm ml-2">
                      ({course.reviews || 0} reviews)
                    </span>
                  </div>
                  <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
                  <div className="flex items-center text-gray-700 font-medium">
                    {(course.students || 0).toLocaleString()} students enrolled
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100">
                <nav className="flex overflow-x-auto">
                  {["overview", "syllabus", "reviews"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabClick(tab)}
                      className={`py-5 px-8 font-bold text-sm uppercase tracking-wide transition-colors whitespace-nowrap relative
                           ${activeTab === tab ? "text-[#D6A419]" : "text-gray-500 hover:text-[#0B2A4A]"}
                         `}
                    >
                      {tab === "syllabus" &&
                        !localStorage.getItem("leadCaptured") && (
                          <Lock size={14} className="inline-block mr-2 mb-1" />
                        )}
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-[#D6A419] rounded-t-full"></span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === "overview" && (
                  <div className="animate-fadeIn">
                    <h3 className="text-xl font-bold text-[#0B2A4A] mb-6">
                      What you'll learn
                    </h3>
                    {course.learningOutcomes?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-10">
                        {course.learningOutcomes.map((outcome, index) => (
                          <div
                            key={index}
                            className="flex items-start p-3 rounded-xl bg-gray-50/80 border border-gray-100"
                          >
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-gray-700 font-medium text-sm">
                              {outcome}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic mb-10">
                        No specific learning outcomes listed.
                      </p>
                    )}

                    <h3 className="text-xl font-bold text-[#0B2A4A] mb-6">
                      Prerequisites
                    </h3>
                    {course.requirements?.length > 0 ? (
                      <ul className="space-y-3 mb-6">
                        {course.requirements.map((req, index) => (
                          <li
                            key={index}
                            className="flex items-center text-gray-700"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">
                        No prerequisites listed.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "syllabus" && (
                  <div className="animate-fadeIn">
                    <h3 className="text-xl font-bold text-[#0B2A4A] mb-6">
                      Course Content
                    </h3>
                    <div className="space-y-4">
                      {course.syllabus?.length > 0 ? (
                        course.syllabus.map((item, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#D6A419]/30 hover:shadow-md transition-all"
                          >
                            <div className="flex justify-between items-center w-full p-5 bg-gray-50 border-b border-gray-100">
                              <span className="font-bold text-[#0B2A4A] text-lg">
                                {item.week}: {item.title}
                              </span>
                            </div>
                            <div className="p-5 bg-white">
                              <ul className="space-y-3">
                                {item.topics.map((topic, topicIndex) => (
                                  <li
                                    key={topicIndex}
                                    className="text-gray-600 flex items-start"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#D6A419] mr-3 mt-2"></div>
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">
                          Syllabus details coming soon.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Other tabs remain similar... */}
                {/* Instructor Tab Removed */}

                {activeTab === "reviews" && (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No reviews yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-32 border border-gray-100">
              <div className="mb-8 pb-8 border-b border-gray-100">
                <p className="text-gray-500 font-medium text-sm mb-1">
                  Total Course Fee
                </p>
                <div className="flex flex-col">
                  {course.salePrice && course.salePrice > 0 ? (
                    <>
                      <span className="text-5xl font-extrabold text-[#0B2A4A]">
                        ₹{course.salePrice?.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        ₹{course.price?.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-5xl font-extrabold text-[#0B2A4A]">
                      ₹{course.price?.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Admissions Open
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <button
                  onClick={() => showInfo("Syllabus download starting...")}
                  className="w-full py-4 bg-[#D6A419] text-white font-bold text-lg rounded-xl hover:bg-yellow-500 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Book size={20} />
                  Download Syllabus
                </button>
              </div>

              <div className="space-y-5 text-sm text-gray-600">
                <h4 className="font-bold text-[#0B2A4A] uppercase tracking-wide">
                  This course includes:
                </h4>
                <div className="flex items-center">
                  <span className="w-8 flex justify-center mr-2">
                    <Users size={20} className="text-[#D6A419]" />
                  </span>
                  In-person Classroom Training
                </div>
                <div className="flex items-center">
                  <span className="w-8 flex justify-center mr-2">
                    <Monitor size={20} className="text-[#D6A419]" />
                  </span>
                  Hands-on Practical Labs
                </div>
                <div className="flex items-center">
                  <span className="w-8 flex justify-center mr-2">
                    <Book size={20} className="text-[#D6A419]" />
                  </span>
                  Printed Study Material
                </div>
                <div className="flex items-center">
                  <span className="w-8 flex justify-center mr-2">
                    <MapPin size={20} className="text-[#D6A419]" />
                  </span>
                  Offline Project Guidance
                </div>
                <div className="flex items-center">
                  <span className="w-8 flex justify-center mr-2">🏆</span>
                  Certificate of completion
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
