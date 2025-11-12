import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
const Courses = () => {
  const [courses, setCourses] = useState([]);
  console.log(courses);

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/courses.json") 
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error(err));
  }, []);

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
    setTimeout(() => {
        fetch("/courses.json")
        .then((res) => res.json())
        .then((data) => setCourses(data))
        .catch((err) => console.error(err));
        setLoading(false);
    }, []);
    }, 1000);
 

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
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      results = results.filter(
        (course) => course.category === selectedCategory
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0B2A4A] mb-4">
            Our Courses
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover a wide range of courses designed to help you advance your
            skills and career. Filter by category, level, or duration to find
            the perfect course for you.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            {/* Search Bar */}
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Courses
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                  placeholder="Search by title, category, or description..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D6A419] focus:border-[#D6A419] transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D6A419] focus:border-[#D6A419] transition-colors"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Level
              </label>
              <select
                id="level"
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D6A419] focus:border-[#D6A419] transition-colors"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level === "all" ? "All Levels" : level}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration
              </label>
              <select
                id="duration"
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D6A419] focus:border-[#D6A419] transition-colors"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
              >
                {durations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration === "all" ? "Any Duration" : duration}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {filteredCourses.length}{" "}
            {filteredCourses.length === 1 ? "course" : "courses"} found
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Sort by:</span>
            <select className="border border-gray-300 rounded-lg py-1 px-2 focus:ring-2 focus:ring-[#D6A419]">
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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D6A419]"></div>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && (
          <>
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-[#D6A419] text-white text-sm font-semibold px-3 py-1 rounded-full">
                        ${course.price}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-[#0B2A4A] text-white text-xs font-medium rounded-full">
                          {course.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {course.duration}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#0B2A4A] mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{course.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-yellow-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-sm font-medium text-gray-700">
                            {course.rating} ({course.students} students)
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            course.level === "Beginner"
                              ? "bg-green-100 text-green-800"
                              : course.level === "Intermediate"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {course.level}
                        </span>
                      </div>
                      <NavLink
                        to={`/course/${course.id}`}
                        className="block w-full text-center px-4 py-2 bg-[#D6A419] text-white font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                      >
                        View Course
                      </NavLink>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
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
                <h3 className="mt-4 text-xl font-medium text-gray-900">
                  No courses found
                </h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 px-4 py-2 bg-[#D6A419] text-white font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Clear all filters
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
