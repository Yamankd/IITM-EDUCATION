import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { Plus, Edit2, Trash2, Search, Loader, Users } from "lucide-react";
import InstructorModal from "./modals/instructorModal.jsx";
import { useAlert } from "../../context/AlertContext";
import { useConfirm } from "../../components/ConfirmDialog";

const InstructorsView = () => {
  const { showError, showSuccess } = useAlert();
  const { showConfirm } = useConfirm();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const token = localStorage.getItem("token");

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/instructors");
      setInstructors(res.data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm({
      title: "Delete Instructor",
      message: "Are you sure you want to delete this instructor?",
      type: "danger",
      confirmText: "Delete",
    });

    if (isConfirmed) {
      try {
        await api.delete(`/instructors/${id}`, {
          headers: { Authorization: token },
        });
        fetchInstructors(); // Assuming this updates the list
        showSuccess("Instructor deleted successfully");
      } catch (error) {
        console.error("Error deleting instructor:", error);
        showError("Failed to delete instructor");
      }
    }
  };

  const handleEdit = (instructor) => {
    setEditData(instructor);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditData(null);
    setShowModal(true);
  };

  const filteredInstructors = instructors.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0B2A4A] dark:text-white flex items-center gap-2">
            <Users className="text-[#D6A419]" /> Instructors
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Manage your team members
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-[#0B2A4A] text-white px-4 py-2 rounded-lg hover:bg-[#0B2A4A]/90 transition-colors shadow-lg"
        >
          <Plus size={20} /> Add Instructor
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Instructor
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Contact
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredInstructors.length > 0 ? (
                filteredInstructors.map((inst) => (
                  <tr
                    key={inst._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={inst.image}
                          alt={inst.name}
                          className="w-10 h-10 rounded-full object-cover border dark:border-gray-600"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/40")
                          }
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {inst.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                      {inst.role}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        {inst.social?.linkedin && (
                          <span className="text-[#0B2A4A] dark:text-[#D6A419] text-xs bg-[#D6A419]/10 dark:bg-[#D6A419]/20 px-2 py-1 rounded">
                            LI
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(inst)}
                        className="p-2 text-[#0B2A4A] hover:bg-[#D6A419]/10 dark:text-[#D6A419] dark:hover:bg-[#D6A419]/20 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(inst._id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    No instructors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InstructorModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onRefresh={fetchInstructors}
        editData={editData}
      />
    </div>
  );
};

export default InstructorsView;
