import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Upload,
  Award,
  Clock,
  FileText,
  Image as ImageIcon,
  X,
} from "lucide-react";
import api from "../../api/api";
import { useAlert } from "../../context/AlertContext";

const CertificateSettings = ({ examId, onCancel, onSave }) => {
  const { showSuccess, showError } = useAlert();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [examTitle, setExamTitle] = useState("");
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingSig, setUploadingSig] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [certificateConfig, setCertificateConfig] = useState({
    titleOverride: "",
    descriptionOverride: "",
    signatureName: "",
    signatureTitle: "",
    signatureImageUrl: "",
    logoImageUrl: "",
    backgroundImageUrl: "",
    showLogo: true,
    showDate: true,
    showId: true,
  });

  const bgImageInputRef = React.useRef(null);
  const sigImageInputRef = React.useRef(null);
  const logoImageInputRef = React.useRef(null);

  useEffect(() => {
    fetchExam();
  }, [examId]);

  const fetchExam = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/certification-exams/admin/${examId}`);
      const exam = data.data || data;
      setExamTitle(exam.title);
      if (exam.certificateConfig) {
        setCertificateConfig((prev) => ({
          ...prev,
          ...exam.certificateConfig,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch exam:", error);
      showError("Failed to load certificate settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCertificateConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBackgroundImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showError("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError("Image size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingBg(true);
    try {
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCertificateConfig((prev) => ({
        ...prev,
        backgroundImageUrl: data.url,
      }));
      showSuccess("Background image uploaded!");
    } catch (error) {
      console.error(error);
      showError("Failed to upload image");
    } finally {
      setUploadingBg(false);
    }
  };

  const handleSignatureImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showError("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showError("Signature image size should be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingSig(true);
    try {
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCertificateConfig((prev) => ({
        ...prev,
        signatureImageUrl: data.url,
      }));
      showSuccess("Signature image uploaded!");
    } catch (error) {
      console.error(error);
      showError("Failed to upload signature image");
    } finally {
      setUploadingSig(false);
    }
  };

  const handleLogoImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showError("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showError("Logo image size should be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingLogo(true);
    try {
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCertificateConfig((prev) => ({
        ...prev,
        logoImageUrl: data.url,
      }));
      showSuccess("Logo image uploaded!");
    } catch (error) {
      console.error(error);
      showError("Failed to upload logo image");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put(`/certification-exams/${examId}`, {
        certificateConfig,
      });

      showSuccess("Certificate settings saved!");
      if (onSave) onSave();
    } catch (error) {
      console.error(error);
      showError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const removeBackgroundImage = () => {
    setCertificateConfig((prev) => ({
      ...prev,
      backgroundImageUrl: "",
    }));
  };

  const removeSignatureImage = () => {
    setCertificateConfig((prev) => ({
      ...prev,
      signatureImageUrl: "",
    }));
  };

  const removeLogoImage = () => {
    setCertificateConfig((prev) => ({
      ...prev,
      logoImageUrl: "",
    }));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Clock size={32} className="text-[#D6A419] animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Loading certificate settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#0B2A4A] dark:text-white flex items-center gap-2">
              <Award className="text-[#D6A419]" />
              Certificate Settings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              For Exam: <span className="font-semibold">{examTitle}</span>
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-[#D6A419] text-[#0B2A4A] rounded-lg font-bold hover:bg-yellow-400 shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {saving ? (
            <Clock size={20} className="animate-spin" />
          ) : (
            <Save size={20} />
          )}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Content - Grid Layout */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Text Customization */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-[#0B2A4A] dark:text-white mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-[#D6A419]" />
                  Text Customization
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Certificate Title Override
                    </label>
                    <input
                      type="text"
                      name="titleOverride"
                      value={certificateConfig.titleOverride}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-[#D6A419] focus:ring-2 focus:ring-[#D6A419]/20 outline-none transition-all"
                      placeholder={
                        examTitle || "e.g. Certified React Developer"
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave blank to use the exam title
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Description Override
                    </label>
                    <textarea
                      name="descriptionOverride"
                      value={certificateConfig.descriptionOverride}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-[#D6A419] focus:ring-2 focus:ring-[#D6A419]/20 outline-none transition-all resize-none"
                      placeholder="e.g. This is to certify that..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave blank to use the default description
                    </p>
                  </div>
                </div>
              </div>

              {/* Signature Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-[#0B2A4A] dark:text-white mb-4 flex items-center gap-2">
                  <Award size={20} className="text-[#D6A419]" />
                  Signature Details
                </h3>

                {/* Instructions Alert */}
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    📝 Signature Image Guidelines
                  </h4>
                  <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                    <li>
                      • <strong>Recommended size:</strong> 600x160 pixels
                      (landscape orientation)
                    </li>
                    <li>
                      • <strong>Format:</strong> PNG with transparent background
                      works best
                    </li>
                    <li>
                      • <strong>Content:</strong> Should contain only the
                      signature (no text)
                    </li>
                    <li>
                      • <strong>Quality:</strong> Use high-resolution scanned
                      signature or digital signature
                    </li>
                    <li>
                      • <strong>Max file size:</strong> 2MB
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Signatory Name
                    </label>
                    <input
                      type="text"
                      name="signatureName"
                      value={certificateConfig.signatureName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-[#D6A419] focus:ring-2 focus:ring-[#D6A419]/20 outline-none transition-all"
                      placeholder="e.g. Dr. Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Signatory Title
                    </label>
                    <input
                      type="text"
                      name="signatureTitle"
                      value={certificateConfig.signatureTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-[#D6A419] focus:ring-2 focus:ring-[#D6A419]/20 outline-none transition-all"
                      placeholder="e.g. Director of Education"
                    />
                  </div>

                  {/* Signature Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Signature Image
                    </label>
                    <input
                      type="file"
                      ref={sigImageInputRef}
                      onChange={handleSignatureImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {!certificateConfig.signatureImageUrl ? (
                      <button
                        onClick={() => sigImageInputRef.current.click()}
                        disabled={uploadingSig}
                        className="w-full px-4 py-8 bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-[#D6A419] hover:bg-[#D6A419]/5 transition-all flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 disabled:opacity-50"
                      >
                        {uploadingSig ? (
                          <>
                            <Clock
                              size={24}
                              className="animate-spin text-[#D6A419]"
                            />
                            <span className="text-sm">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={24} />
                            <span className="text-sm font-medium">
                              Upload Signature Image
                            </span>
                            <span className="text-xs">PNG, JPG (max 2MB)</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="relative bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <button
                          onClick={removeSignatureImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                        <img
                          src={certificateConfig.signatureImageUrl}
                          alt="Signature"
                          className="w-full h-32 object-contain"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      The signature image will appear above the signatory name
                      on the certificate. Use a clean, high-contrast signature
                      for best results.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Logo Image */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-[#0B2A4A] dark:text-white mb-4 flex items-center gap-2">
                  <ImageIcon size={20} className="text-[#D6A419]" />
                  Certificate Logo
                </h3>

                {/* Instructions Alert */}
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">
                    🏢 Logo Image Guidelines
                  </h4>
                  <ul className="text-xs text-green-800 dark:text-green-400 space-y-1">
                    <li>
                      • <strong>Purpose:</strong> Appears in the top-right
                      corner of the certificate
                    </li>
                    <li>
                      • <strong>Recommended size:</strong> 300x300 pixels
                      (square or landscape)
                    </li>
                    <li>
                      • <strong>Format:</strong> PNG with transparent background
                      recommended
                    </li>
                    <li>
                      • <strong>Max file size:</strong> 2MB
                    </li>
                    <li>
                      • <strong>Note:</strong> Leave empty to use the default
                      institutional logo
                    </li>
                  </ul>
                </div>

                <input
                  type="file"
                  ref={logoImageInputRef}
                  onChange={handleLogoImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                {!certificateConfig.logoImageUrl ? (
                  <button
                    onClick={() => logoImageInputRef.current.click()}
                    disabled={uploadingLogo}
                    className="w-full px-4 py-8 bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-[#D6A419] hover:bg-[#D6A419]/5 transition-all flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 disabled:opacity-50"
                  >
                    {uploadingLogo ? (
                      <>
                        <Clock
                          size={24}
                          className="animate-spin text-[#D6A419]"
                        />
                        <span className="text-sm">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={24} />
                        <span className="text-sm font-medium">
                          Upload Logo Image
                        </span>
                        <span className="text-xs">PNG, JPG (max 2MB)</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="relative bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <button
                      onClick={removeLogoImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <img
                      src={certificateConfig.logoImageUrl}
                      alt="Logo"
                      className="w-full h-32 object-contain"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  This logo will appear in the top-right corner of the
                  certificate. If not uploaded, the default logo will be used.
                </p>
              </div>

              {/* Background Image */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-[#0B2A4A] dark:text-white mb-4 flex items-center gap-2">
                  <ImageIcon size={20} className="text-[#D6A419]" />
                  Background Image (Optional)
                </h3>

                {/* Instructions Alert */}
                <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-2">
                    🎨 Background Image Tips
                  </h4>
                  <ul className="text-xs text-amber-800 dark:text-amber-400 space-y-1">
                    <li>
                      • <strong>Purpose:</strong> Adds a subtle watermark to the
                      certificate background
                    </li>
                    <li>
                      • <strong>Recommended size:</strong> 1920x1080px for best
                      quality
                    </li>
                    <li>
                      • <strong>Opacity:</strong> Image will be displayed at 3%
                      opacity as a watermark
                    </li>
                    <li>
                      • <strong>Best use:</strong> Institutional logos, emblems,
                      or decorative patterns
                    </li>
                    <li>
                      • <strong>Max file size:</strong> 5MB
                    </li>
                  </ul>
                </div>

                <input
                  type="file"
                  ref={bgImageInputRef}
                  onChange={handleBackgroundImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                {!certificateConfig.backgroundImageUrl ? (
                  <button
                    onClick={() => bgImageInputRef.current.click()}
                    disabled={uploadingBg}
                    className="w-full px-4 py-16 bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-[#D6A419] hover:bg-[#D6A419]/5 transition-all flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 disabled:opacity-50"
                  >
                    {uploadingBg ? (
                      <>
                        <Clock
                          size={32}
                          className="animate-spin text-[#D6A419]"
                        />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={32} />
                        <span className="font-medium">
                          Upload Background Image
                        </span>
                        <span className="text-sm">PNG, JPG (max 5MB)</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="relative">
                    <button
                      onClick={removeBackgroundImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                    >
                      <X size={20} />
                    </button>
                    <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img
                        src={certificateConfig.backgroundImageUrl}
                        alt="Certificate Background"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  The background image will appear as a subtle watermark (3%
                  opacity) centered on the certificate. Leave empty for a clean
                  white background.
                </p>
              </div>

              {/* Display Options */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-[#0B2A4A] dark:text-white mb-4">
                  Display Options
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-[#D6A419] transition-all">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Show Logo
                    </span>
                    <input
                      type="checkbox"
                      name="showLogo"
                      checked={certificateConfig.showLogo !== false}
                      onChange={handleChange}
                      className="w-5 h-5 text-[#D6A419] rounded focus:ring-[#D6A419]"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-[#D6A419] transition-all">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Show Issue Date
                    </span>
                    <input
                      type="checkbox"
                      name="showDate"
                      checked={certificateConfig.showDate !== false}
                      onChange={handleChange}
                      className="w-5 h-5 text-[#D6A419] rounded focus:ring-[#D6A419]"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-[#D6A419] transition-all">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Show Certificate ID
                    </span>
                    <input
                      type="checkbox"
                      name="showId"
                      checked={certificateConfig.showId !== false}
                      onChange={handleChange}
                      className="w-5 h-5 text-[#D6A419] rounded focus:ring-[#D6A419]"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateSettings;
