import React, { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import { Plus, Trash2, GripVertical, Save, X, HelpCircle } from "lucide-react";
import api from "../../api/api";

const FAQView = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });
  const [saving, setSaving] = useState(false);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data } = await api.get("/faqs");
      setFaqs(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setLoading(false);
    }
  };

  const handleReorder = (newOrder) => {
    setFaqs(newOrder);
    setHasOrderChanged(true);
  };

  const saveOrder = async () => {
    try {
      const orderIds = faqs.map((faq) => faq._id);
      await api.put("/faqs/reorder", { order: orderIds });
      setHasOrderChanged(false);
      alert("Order saved successfully!");
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        await api.delete(`/faqs/${id}`);
        setFaqs(faqs.filter((faq) => faq._id !== id));
      } catch (error) {
        console.error("Error deleting FAQ:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post("/faqs", formData);
      setFaqs([...faqs, data]);
      setShowModal(false);
      setFormData({ question: "", answer: "" });
    } catch (error) {
      console.error("Error creating FAQ:", error);
      alert("Failed to create FAQ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-[#0B2A4A] dark:text-white flex items-center gap-2">
            <HelpCircle className="text-[#D6A419]" /> FAQ Manager
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage frequently asked questions
          </p>
        </div>
        <div className="flex gap-2">
          {hasOrderChanged && (
            <button
              onClick={saveOrder}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Save size={20} />
              Save Order
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#D6A419] text-white rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            Add FAQ
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D6A419]"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {faqs.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No FAQs found. Add one to get started!
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={faqs}
              onReorder={handleReorder}
              className="divide-y divide-gray-100 dark:divide-gray-700"
            >
              {faqs.map((faq) => (
                <Reorder.Item
                  key={faq._id}
                  value={faq}
                  className="p-4 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 bg-white dark:bg-gray-800"
                >
                  <div className="mt-1 cursor-grab active:cursor-grabbing text-gray-400">
                    <GripVertical size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {faq.question}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 whitespace-pre-wrap">
                      {faq.answer}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(faq._id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete FAQ"
                  >
                    <Trash2 size={18} />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>
      )}

      {/* Add FAQ Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-bold text-[#0B2A4A] dark:text-white">
                Add New FAQ
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D6A419]"
                  placeholder="e.g. What is the course duration?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Answer
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D6A419]"
                  placeholder="Enter the detailed answer..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#D6A419] hover:bg-yellow-500"
                  }`}
                >
                  {saving ? "Saving..." : "Add FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQView;
