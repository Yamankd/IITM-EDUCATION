import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import api from "../api/api";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  BookOpen,
  Clock,
  BarChart,
} from "lucide-react"; // Assuming you might have lucide-react, if not, I'll stick to SVGs in code
import SEO from "../components/common/SEO";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses");
      setCourses(data.filter((course) => !course.isDraft));
      setFilteredCourses(data.filter((course) => !course.isDraft));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  // Categories for filter
  const categories = [
    "all",
    "Computer Science",
    "Data Science",
    "Artificial Intelligence",
    "Web Development",
    "Mobile Development",
    "Cloud Computing",
  ];
  const levels = ["all", "Beginner", "Intermediate", "Advanced"];
  const durations = [
    "all",
    "Under 10 weeks",
    "10-15 weeks",
    "16-20 weeks",
    "Over 20 weeks",
  ];

  useEffect(() => {
    filterCourses();
  }, [searchTerm, selectedCategory, selectedLevel, selectedDuration, courses]);

  const filterCourses = () => {
    let results = courses;

    // Search filter
    if (searchTerm) {
      results = results.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      results = results.filter(
        (course) => course.category === selectedCategory,
      );
    }

    // Level filter
    if (selectedLevel !== "all") {
      results = results.filter((course) => course.level === selectedLevel);
    }

    // Duration filter
    if (selectedDuration !== "all") {
      switch (selectedDuration) {
        case "Under 10 weeks":
          results = results.filter((course) => parseInt(course.duration) < 10);
          break;
        case "10-15 weeks":
          results = results.filter((course) => {
            const weeks = parseInt(course.duration);
            return weeks >= 10 && weeks <= 15;
          });
          break;
        case "16-20 weeks":
          results = results.filter((course) => {
            const weeks = parseInt(course.duration);
            return weeks >= 16 && weeks <= 20;
          });
          break;
        case "Over 20 weeks":
          results = results.filter((course) => parseInt(course.duration) > 20);
          break;
        default:
          break;
      }
    }

    setFilteredCourses(results);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSelectedDuration("all");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 font-sans">
      <SEO
        title="All Courses"
        description="Browse our wide range of computer education courses. From basic computer skills to advanced programming and data science."
        keywords="courses, computer education, programming, coding classes"
      />
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <span className="text-[#D6A419] font-bold tracking-wider uppercase text-sm">
            Unlock Your Potential
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0B2A4A] tracking-tight">
            Explore Our Courses
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover expert-led courses designed to help you master new skills,
            advance your career, and achieve your goals.
          </p>
        </div>

        {/* Search and Filter Section - Floating Card Style */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 md:p-8 mb-12 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search Bar */}
            <div className="lg:col-span-4">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 group-focus-within:text-[#D6A419] transition-colors"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  placeholder="What do you want to learn?"
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D6A419] focus:border-[#D6A419] focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="space-y-1.5">
              <label
                htmlFor="category"
                className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1"
              >
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  className="block w-full py-3 pl-4 pr-10 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D6A419] focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer hover:border-gray-300"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="level"
                className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1"
              >
                Level
              </label>
              <div className="relative">
                <select
                  id="level"
                  className="block w-full py-3 pl-4 pr-10 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D6A419] focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer hover:border-gray-300"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level === "all" ? "All Levels" : level}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="duration"
                className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1"
              >
                Duration
              </label>
              <div className="relative">
                <select
                  id="duration"
                  className="block w-full py-3 pl-4 pr-10 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D6A419] focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer hover:border-gray-300"
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                >
                  {durations.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration === "all" ? "Any Duration" : duration}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full py-3 px-4 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 hover:text-gray-900 transition-colors focus:ring-2 focus:ring-gray-300 focus:outline-none flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 px-2">
          <p className="text-gray-600 font-medium">
            Showing{" "}
            <span className="text-[#0B2A4A] font-bold">
              {filteredCourses.length}
            </span>{" "}
            {filteredCourses.length === 1 ? "course" : "courses"}
          </p>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <span className="text-gray-500 text-sm">Sort by:</span>
            <select className="border-none bg-transparent font-semibold text-[#0B2A4A] focus:ring-0 cursor-pointer text-sm p-0 pr-6">
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#D6A419]"></div>
            <p className="mt-4 text-gray-500 font-medium">
              Loading amazing courses...
            </p>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && (
          <>
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <div
                    key={course._id}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.image || "https://via.placeholder.com/300"}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#0B2A4A] text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                        ₹
                        {course.salePrice > 0 ? course.salePrice : course.price}
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-[#D6A419] text-white text-xs font-bold uppercase tracking-wide rounded-md shadow-sm">
                          {course.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 mb-3">
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          {course.duration}
                        </span>
                        <span>•</span>
                        <span
                          className={`
                          ${course.level === "Beginner" ? "text-green-600" : course.level === "Intermediate" ? "text-blue-600" : "text-purple-600"}
                        `}
                        >
                          {course.level}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#0B2A4A] mb-3 line-clamp-2 group-hover:text-[#D6A419] transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed flex-grow">
                        {course.description}
                      </p>

                      <div className="border-t border-gray-100 pt-4 mt-auto">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(course.rating || 4.5) ? "fill-current" : "text-gray-300 fill-current"}`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-2 text-xs font-semibold text-gray-500">
                              ({course.students} students)
                            </span>
                          </div>
                        </div>

                        <NavLink
                          to={`/course/${course.slug || course._id}`}
                          className="block w-full text-center px-4 py-3 bg-gray-50 text-[#0B2A4A] font-bold rounded-xl border border-gray-200 hover:bg-[#0B2A4A] hover:text-white hover:border-[#0B2A4A] transition-all duration-300 shadow-sm"
                        >
                          View Details
                        </NavLink>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center max-w-2xl mx-auto">
                <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="h-10 w-10 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No courses found
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  We couldn't find any courses matching your filters. Try
                  searching for something else or adjusting your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 bg-[#D6A419] text-white font-bold rounded-xl hover:bg-yellow-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;
