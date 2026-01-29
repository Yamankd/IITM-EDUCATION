import React, { useState, useEffect } from "react";
import api from "../../api/api";
import {
  Trash2,
  Plus,
  Upload,
  X,
  Filter,
  Image as ImageIcon,
  Search,
  Check,
  Edit2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import DropzoneArea from "./DropzoneArea";

const GalleryView = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [filterSection, setFilterSection] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Selection for Bulk Delete
  const [selectedImages, setSelectedImages] = useState([]);

  // Form Data (Upload)
  const [files, setFiles] = useState([]);
  const [section, setSection] = useState("campus");
  const [eventName, setEventName] = useState("");
  const [title, setTitle] = useState("");

  // Form Data (Edit)
  const [editId, setEditId] = useState(null);
  const [editSection, setEditSection] = useState("campus");
  const [editEventName, setEditEventName] = useState("");
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    fetchImages();
  }, [filterSection, page]); // Fetch on section or page change. Search is handled manually or debounced (here manual)

  const fetchImages = async () => {
    try {
      setLoading(true);
      let query = `?page=${page}&limit=12`;

      if (filterSection !== "all") query += `&section=${filterSection}`;
      if (searchTerm) query += `&search=${searchTerm}`;

      const { data } = await api.get(`/gallery${query}`);
      setImages(data.images);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 on search
    fetchImages();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select at least one image");

    try {
      setUploading(true);
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
      formData.append("section", section);
      formData.append("eventName", eventName);
      formData.append("title", title);

      await api.post("/gallery/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Refresh list
      fetchImages();
      setShowUploadModal(false);
      resetForm();
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to upload image";
      alert(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await api.delete(`/gallery/${id}`);
      setImages(images.filter((img) => img._id !== id));
      // Remove from selection if present
      setSelectedImages(selectedImages.filter((sid) => sid !== id));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    if (
      !confirm(
        `Are you sure you want to delete ${selectedImages.length} images?`,
      )
    )
      return;

    try {
      await api.post("/gallery/bulk-delete", { ids: selectedImages });
      setImages(images.filter((img) => !selectedImages.includes(img._id)));
      setSelectedImages([]);
      fetchImages(); // Refresh to fill gaps
    } catch (error) {
      console.error("Error deleting images:", error);
      alert("Failed to delete selected images");
    }
  };

  const handleSelectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map((img) => img._id));
    }
  };

  const toggleSelection = (id) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter((sid) => sid !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  const openEditModal = (img) => {
    setEditId(img._id);
    setEditTitle(img.title || "");
    setEditSection(img.section || "campus");
    setEditEventName(img.eventName || "");
    setShowEditModal(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/gallery/${editId}`, {
        title: editTitle,
        section: editSection,
        eventName: editEventName,
      });

      // Update local state
      setImages(images.map((img) => (img._id === editId ? data.image : img)));
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating image:", error);
      alert("Failed to update image details");
    }
  };

  const resetForm = () => {
    setFiles([]);
    setSection("campus");
    setEventName("");
    setTitle("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0B2A4A] dark:text-white flex items-center gap-2">
            <ImageIcon className="text-[#D6A419]" /> Gallery Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage campus and event photos
          </p>
        </div>
        <div className="flex gap-2">
          {selectedImages.length > 0 && (
            <>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <Trash2 size={20} /> Delete ({selectedImages.length})
              </button>
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Check size={20} />{" "}
                {selectedImages.length === images.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </>
          )}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D6A419] text-white rounded-lg hover:bg-yellow-500 transition-colors font-medium"
          >
            <Plus size={20} /> Upload Image
          </button>
        </div>
      </div>

      {/* Controls: Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by title or event..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D6A419]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </form>

        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-500" />
          <select
            value={filterSection}
            onChange={(e) => {
              setFilterSection(e.target.value);
              setPage(1); // Reset page on filter change
            }}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D6A419]"
          >
            <option value="all">All Sections</option>
            <option value="campus">Campus</option>
            <option value="events">Events</option>
            <option value="classroom">Classroom</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D6A419]"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div
                key={img._id}
                className={`group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border ${selectedImages.includes(img._id) ? "border-[#D6A419] ring-2 ring-[#D6A419]/20" : "border-gray-100 dark:border-gray-700"}`}
              >
                <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                  <img
                    src={img.imageUrl}
                    alt={img.title || "Gallery Image"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      onClick={() => toggleSelection(img._id)}
                      className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${selectedImages.includes(img._id) ? "bg-[#D6A419] border-[#D6A419] text-white" : "bg-white/80 border-gray-400 text-transparent hover:border-[#D6A419]"}`}
                    >
                      <Check size={14} />
                    </button>
                  </div>

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditModal(img)}
                      className="p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white transition-colors"
                      title="Edit Details"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(img._id)}
                      className="p-2 bg-red-600/90 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded backdrop-blur-sm uppercase tracking-wider font-semibold">
                    {img.section}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                    {img.title || "Untitled"}
                  </h3>
                  {img.eventName && (
                    <p className="text-xs text-[#D6A419] font-medium mt-1 truncate">
                      {img.eventName}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(img.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {images.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p>No images found.</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-bold text-[#0B2A4A] dark:text-white">
                Upload New Image
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {/* File Input */}
              <DropzoneArea
                onDrop={(acceptedFiles) => setFiles(acceptedFiles)}
                files={files}
              />

              {/* Section Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D6A419]"
                >
                  <option value="campus">Campus</option>
                  <option value="events">Events</option>
                  <option value="classroom">Classroom</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Event Name */}
              {section === "events" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Annual Tech Fest 2025"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D6A419]"
                  />
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title / Caption (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief description..."
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D6A419]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-[#D6A419] hover:bg-yellow-500"}`}
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={20} /> Upload Image
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-bold text-[#0B2A4A] dark:text-white">
                Edit Image Details
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              {/* Section Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Section
                </label>
                <select
                  value={editSection}
                  onChange={(e) => setEditSection(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D6A419]"
                >
                  <option value="campus">Campus</option>
                  <option value="events">Events</option>
                  <option value="classroom">Classroom</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Event Name */}
              {editSection === "events" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={editEventName}
                    onChange={(e) => setEditEventName(e.target.value)}
                    placeholder="e.g. Annual Tech Fest 2025"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D6A419]"
                  />
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title / Caption (Optional)
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Brief description..."
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D6A419]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 bg-[#D6A419] hover:bg-yellow-500"
                >
                  <Check size={20} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryView;
