import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  UserPlus,
  Copy,
  Check,
  Edit2,
  Trash2,
} from "lucide-react";
import api from "../../api/api";
import { useAlert } from "../../context/AlertContext";
import { useConfirm } from "../../components/ConfirmDialog";

const StudentsView = () => {
  const { showError, showSuccess } = useAlert();
  const { showConfirm } = useConfirm();
  const [students, setStudents] = useState([]); // Would fetch all students ideally, but for now we might just create
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); // For edit mode
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    courseId: "",
  });
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses");
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses");
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/students");
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        // Update existing student
        const enrolledCourses = formData.courseId
          ? [formData.courseId]
          : editingStudent.enrolledCourses &&
              editingStudent.enrolledCourses.length > 0
            ? editingStudent.enrolledCourses.map((c) =>
                typeof c === "object" ? c._id : c,
              )
            : [];

        await api.put(`/students/${editingStudent._id}`, {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          enrolledCourses,
        });
        showSuccess("Student updated successfully!");
        setShowModal(false);
        setEditingStudent(null);
      } else {
        // Create new student
        const { data } = await api.post("/students/create-by-admin", formData);
        setCreatedCredentials({
          email: data.email,
          password: data.generatedPassword,
        });
      }
      setFormData({ name: "", email: "", mobile: "", courseId: "" });
      fetchStudents(); // Refresh the list
    } catch (error) {
      showError(
        error.response?.data?.message ||
          `Failed to ${editingStudent ? "update" : "create"} student`,
      );
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      courseId: student.enrolledCourses[0]?._id || "",
    });
    setShowModal(true);
    setCreatedCredentials(null);
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    const isConfirmed = await showConfirm({
      title: "Delete Student",
      message: `Are you sure you want to delete "${studentName}"? This action cannot be undone.`,
      type: "danger",
      confirmText: "Delete",
    });

    if (isConfirmed) {
      try {
        await api.delete(`/students/${studentId}`);
        fetchStudents(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete student");
        showError("Failed to delete student. Please try again.");
      }
    }
  };

  const copyToClipboard = () => {
    const text = `Email: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0B2A4A] dark:text-white">
            Student Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Create students and assign them to courses.
          </p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingStudent(null);
            setFormData({ name: "", email: "", mobile: "", courseId: "" });
            setCreatedCredentials(null);
          }}
          className="px-4 py-2 bg-[#D6A419] text-[#0B2A4A] rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors"
        >
          <UserPlus size={20} />
          Add Student
        </button>
      </div>

      {/* Students List */}
      {students.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Enrolled Courses
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#D6A419]/10 dark:bg-[#D6A419]/20 flex items-center justify-center text-[#0B2A4A] dark:text-[#D6A419] font-bold">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {student.mobile}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {student.enrolledCourses &&
                        student.enrolledCourses.length > 0 ? (
                          student.enrolledCourses.map((course) => (
                            <span
                              key={course._id}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D6A419]/10 text-[#D6A419] border border-[#D6A419]/20"
                            >
                              {course.title}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500 italic">
                            No courses enrolled
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="p-2 text-[#0B2A4A] hover:bg-[#D6A419]/10 dark:text-[#D6A419] dark:hover:bg-[#D6A419]/20 rounded-lg transition-colors"
                          title="Edit Student"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteStudent(student._id, student.name)
                          }
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700">
          <div className="mx-auto w-16 h-16 bg-[#D6A419]/10 dark:bg-[#D6A419]/20 rounded-full flex items-center justify-center text-[#0B2A4A] dark:text-[#D6A419] mb-4">
            <UserPlus size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#0B2A4A] dark:text-white mb-2">
            No Students Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Use the "Add Student" button to create a student account,
            auto-assign a course, and generate their login credentials.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-[#0B2A4A] dark:text-white mb-6">
              {createdCredentials
                ? "Credentials Generated"
                : editingStudent
                  ? "Edit Student"
                  : "Add New Student"}
            </h3>

            {createdCredentials ? (
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <p className="text-sm text-green-800 dark:text-green-300 mb-4 font-medium">
                    Student account created successfully! Please copy these
                    credentials now.
                  </p>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-bold text-gray-800 dark:text-white">
                        {createdCredentials.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Password:</span>
                      <span className="font-bold text-gray-800 dark:text-white">
                        {createdCredentials.password}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 py-2 bg-[#D6A419] text-[#0B2A4A] rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-yellow-400"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? "Copied!" : "Copy Details"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-[#D6A419]"
                    placeholder="Student Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-[#D6A419]"
                    placeholder="student@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Mobile Number
                  </label>
                  <input
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-[#D6A419]"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Assign Course
                  </label>
                  <select
                    name="courseId"
                    required={!editingStudent}
                    value={formData.courseId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-[#D6A419]"
                  >
                    <option value="">Select a Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#D6A419] text-[#0B2A4A] rounded-lg font-bold hover:bg-yellow-400"
                  >
                    {editingStudent ? "Update Student" : "Create Student"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsView;
