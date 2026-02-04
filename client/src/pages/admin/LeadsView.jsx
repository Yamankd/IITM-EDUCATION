import React, { useState, useEffect } from "react";
import api from "../../api/api";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MoreVertical,
  Mail,
  Phone,
  User,
  MessageSquare,
  Calendar,
  Trash2,
} from "lucide-react";
import { useAlert } from "../../context/AlertContext";
import { useConfirm } from "../../components/ConfirmDialog";

const LeadsView = () => {
  const { showError, showSuccess } = useAlert();
  const { showConfirm } = useConfirm();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });

  const fetchLeads = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        status: filters.status,
        search: filters.search,
      });
      const response = await api.get(`/leads?${queryParams.toString()}`);
      if (response.data.success) {
        setLeads(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(1);
  }, [filters]); // Debounce could be added for search if needed

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      fetchLeads(newPage);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token"); // Changed to "token" based on other files using it directly or "adminToken"
      // Actually checking other files, they use 'token' or 'adminToken'?
      // AdminDashboard uses 'adminToken' for logout but Login sets 'adminToken'?
      // Let's check api.js or InstructorsView. InstructorsView uses 'token'.
      // AdminDashboard logout uses 'adminToken'. This is inconsistent.
      // Wait, let me check InstructorsView again. It uses `localStorage.getItem("token")`.
      // AdminDashboard uses `localStorage.removeItem("adminToken")`.
      // This suggests a mixup. I will use `localStorage.getItem("adminToken")` as this is the admin panel.
      // If that fails I'll try 'token'.

      await api.put(`/leads/${id}`, { status: newStatus });
      fetchLeads(pagination.page);
    } catch (error) {
      console.error("Failed to update status", error);
      showError("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm({
      title: "Delete Lead",
      message: "Are you sure you want to delete this lead?",
      type: "danger",
      confirmText: "Delete",
    });

    if (!isConfirmed) return;

    try {
      await api.delete(`/leads/${id}`);
      fetchLeads(pagination.page);
      showSuccess("Lead deleted successfully");
    } catch (error) {
      console.error("Failed to delete lead", error);
      showError("Failed to delete lead");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Lead Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            View and manage all student enquiries
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search name, email..."
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6A419] w-64 dark:bg-gray-700 dark:text-white"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6A419] dark:bg-gray-700 dark:text-white"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
          </select>
          <button
            onClick={() => fetchLeads(pagination.page)}
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors dark:text-white"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        {loading && leads.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            No leads found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                    Date
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                    Name
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                    Contact
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                    Status
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                    Course Interest
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                    Message
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {leads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {formatDate(lead.createdAt)}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        {lead.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Mail size={14} /> {lead.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Phone size={14} /> {lead.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={lead.status || "new"}
                        onChange={(e) =>
                          handleUpdateStatus(lead._id, e.target.value)
                        }
                        className={`px-2 py-1 text-xs font-medium rounded-full border-0 outline-none cursor-pointer
                        ${
                          lead.status === "resolved"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : lead.status === "contacted"
                              ? "bg-[#D6A419]/10 text-[#0B2A4A] dark:bg-[#D6A419]/20 dark:text-[#D6A419]"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="p-4 text-gray-800 dark:text-gray-200">
                      {lead.courseId ? (
                        <span className="px-2 py-1 bg-[#D6A419]/10 dark:bg-[#D6A419]/20 text-[#0B2A4A] dark:text-[#D6A419] rounded text-sm font-medium">
                          {lead.courseId.title}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">General</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 text-sm max-w-xs truncate">
                      {lead.message || "-"}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {pagination.page} of {pagination.pages} ({pagination.total}{" "}
            leads)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1 flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:text-gray-300"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="px-3 py-1 flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:text-gray-300"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsView;
