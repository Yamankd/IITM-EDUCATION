import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import { X, Upload, Loader } from "lucide-react";
import { useAlert } from "../../../context/AlertContext";

const InstructorModal = ({ show, onClose, onRefresh, editData }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "",
    social: {
      linkedin: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { showError } = useAlert();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        role: editData.role,
        image: editData.image,
        social: {
          linkedin: editData.social?.linkedin || "",
        },
      });
    } else {
      setFormData({
        name: "",
        role: "",
        image: "",
        social: { linkedin: "" },
      });
    }
  }, [editData, show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showError("Please upload a valid image file (JPEG, PNG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      showError("Image size should be less than 5MB");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    setUploading(true);

    try {
      // When using api instance, we need to let axios set the Content-Type for FormData
      // which includes the boundary. We override the default application/json here.
      const res = await api.post("/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });
      // Backend returns { url: "...", public_id: "..." }
      setFormData((prev) => ({ ...prev, image: res.data.url }));
    } catch (error) {
      console.error("Upload failed:", error);
      showError("Image upload failed. Please check server logs.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        await api.put(`/instructors/${editData._id}`, formData, {
          headers: { Authorization: token },
        });
      } else {
        await api.post("/instructors", formData, {
          headers: { Authorization: token },
        });
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error saving instructor:", error);
      showError("Failed to save instructor");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">
            {editData ? "Edit Instructor" : "Add New Instructor"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Social Links
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    name="social.linkedin"
                    placeholder="LinkedIn URL"
                    value={formData.social.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Image
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                {formData.image ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-40 w-40 object-cover rounded-full mx-auto border-2 border-gray-100 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: "" }))
                      }
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    {uploading ? (
                      <Loader className="animate-spin mx-auto text-blue-600" />
                    ) : (
                      <>
                        <Upload
                          className="mx-auto text-gray-400 dark:text-gray-500 mb-2"
                          size={32}
                        />
                        <label className="cursor-pointer bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                          Upload Image
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader className="animate-spin" size={16} /> : null}
              {editData ? "Update Instructor" : "Add Instructor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstructorModal;
