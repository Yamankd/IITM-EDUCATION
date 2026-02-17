import React, { useState, useEffect } from "react";
import api from "../../api/api";
import {
  Moon,
  Sun,
  Lock,
  Bell,
  User,
  Mail,
  Globe,
  Save,
  Shield,
  Check,
  Phone,
  Contact,
  Search,
  Cookie,
  Trash2,
  Plus,
  Palette,
  Palette as ColorPicker, // Mocking ColorPicker with Palette for now, in real app assumes a component
  FileText,
  Wrench,
} from "lucide-react";

// Mock ColorPicker component since it was implied but not defined in imports
const ColorPickerComponent = ({ label, value, onChange, description }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-20 cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg outline-none dark:bg-gray-700 dark:text-white"
      />
    </div>
    {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
  </div>
);

const SettingsView = ({ darkMode, toggleDarkMode }) => {
  const [activeSection, setActiveSection] = useState("general");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Digital IITM",
    supportEmail: "support@digitaliitm.com",
    language: "English",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    newLead: true,
    weeklyReport: false,
  });

  const [profile, setProfile] = useState({
    name: "",
    email: "", // Login Email
    contactEmail: "",
    mobile: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "Digital IITM - Professional IT Training",
    metaDescription: "Learn cutting-edge technologies with expert instructors",
    keywords: "IT training, MERN stack, web development, programming courses",
    googleAnalyticsId: "",
    googleTagManagerId: "", // GTM-XXXXXXX
    faviconUrl: "",
    ogImage: "",
    customHeadScripts: "", // For Google Analytics and other custom scripts
    cookieConsentEnabled: true,
    cookieMessage:
      "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.",
    cookieButtonText: "Accept",
    privacyPolicyUrl: "/privacy-policy",
    featureFlags: {
      freeCertification: false,
    },
  });

  const [branding, setBranding] = useState({
    logoUrl: "",
    footerLogoUrl: "",
    footerText: "",
    primaryColor: "#0B2A4A",
    secondaryColor: "#D6A419",
    socialLinks: [],
    customCSS: "",
  });

  const [maintenanceMode, setMaintenanceMode] = useState({
    enabled: false,
    message: "",
    allowedIPs: "",
    estimatedCompletion: "",
    showCountdown: false,
  });

  const [content, setContent] = useState({
    aboutUs: "",
    privacyPolicy: "",
    termsAndConditions: "",
    refundPolicy: "",
    contactInfo: {
      address: "",
      phone: "",
      email: "",
      mapUrl: "",
    },
  });

  const [footer, setFooter] = useState({
    description:
      "Providing quality computer education and shaping the next generation of tech experts since 2010.",
    quickLinks: [],
    courses: [],
  });

  // Load saved SEO settings from localStorage
  // Load saved SEO settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        if (data.success) {
          const settings = data.data;
          setSeoSettings((prev) => ({ ...prev, ...settings }));

          // Load Phase 2 settings
          if (settings.branding) {
            setBranding((prev) => ({ ...prev, ...settings.branding }));
          }
          if (settings.footer) {
            setFooter((prev) => ({ ...prev, ...settings.footer }));
          }
          if (settings.maintenanceMode) {
            setMaintenanceMode((prev) => ({
              ...prev,
              ...settings.maintenanceMode,
              allowedIPs: settings.maintenanceMode.allowedIPs?.join("\n") || "",
            }));
          }
          if (settings.content) {
            setContent((prev) => ({ ...prev, ...settings.content }));
          }
        }
      } catch (error) {
        console.error("Error fetching SEO settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (section) => {
    setLoading(true);

    if (section === "seo") {
      try {
        await api.put("/settings", seoSettings);
        setSuccess("seo");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        console.error("Error saving SEO settings:", error);
        // Temporary error handling, maybe add a toast later
      } finally {
        setLoading(false);
      }
      return;
    }

    // Phase 2: Branding
    if (section === "branding") {
      try {
        await api.put("/settings", { branding });
        setSuccess("branding");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        console.error("Error saving branding settings:", error);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Phase 2: Footer (Merged with Branding)
    if (section === "footer") {
      try {
        await api.put("/settings", { footer, branding, content });
        setSuccess("footer");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        console.error("Error saving footer settings:", error);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Phase 2: Maintenance Mode
    if (section === "maintenance") {
      try {
        const maintenanceData = {
          ...maintenanceMode,
          allowedIPs: maintenanceMode.allowedIPs
            .split("\n")
            .filter((ip) => ip.trim()),
        };
        await api.put("/settings", { maintenanceMode: maintenanceData });
        setSuccess("maintenance");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        console.error("Error saving maintenance settings:", error);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Phase 2: Content Management
    if (section === "content") {
      try {
        await api.put("/settings", { content });
        setSuccess("content");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        console.error("Error saving content settings:", error);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Simulate API call for non-security settings
    setTimeout(() => {
      setLoading(false);
      setSuccess(section);
      setTimeout(() => setSuccess(""), 3000);
    }, 1000);
  };

  const handleUpdateProfile = async () => {
    setError("");
    setSuccess("");

    if (!profile.currentPassword) {
      setError("Current password is required to save changes.");
      return;
    }

    if (profile.newPassword && profile.newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (
      profile.newPassword &&
      profile.newPassword !== profile.confirmPassword
    ) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Construct payload with only populated fields
      const payload = {
        currentPassword: profile.currentPassword,
      };

      if (profile.name) payload.name = profile.name;
      if (profile.email) payload.email = profile.email;
      if (profile.contactEmail) payload.contactEmail = profile.contactEmail;
      if (profile.mobile) payload.mobile = profile.mobile;
      if (profile.newPassword) payload.newPassword = profile.newPassword;

      await api.put("/update-admin", payload);

      setSuccess("profile");
      // Clear sensitive fields
      setProfile({
        name: "",
        email: "",
        contactEmail: "",
        mobile: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to update profile settings",
      );
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: "general", label: "General", icon: <Globe size={18} /> },
    { id: "profile", label: "Admin Profile", icon: <User size={18} /> },
    { id: "seo", label: "SEO & Analytics", icon: <Search size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    // Branding merged into Footer
    { id: "footer", label: "Footer & Branding", icon: <Palette size={18} /> },
    { id: "features", label: "Feature Flags", icon: <Shield size={18} /> },
    { id: "appearance", label: "Appearance", icon: <Sun size={18} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0B2A4A] dark:text-white">
            Settings
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Manage your dashboard preferences
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === section.id
                  ? "bg-[#0B2A4A] text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#0B2A4A] dark:hover:text-gray-200"
              }`}
            >
              {section.icon}
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeSection === "general" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
              <h3 className="text-lg font-semibold dark:text-white mb-4">
                General Information
              </h3>
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Name
                  </label>
                  <div className="relative">
                    <Globe
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          siteName: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Support Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          supportEmail: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => handleSave("general")}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0B2A4A]/90 transition-colors"
                >
                  {loading && success !== "general" ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : success === "general" ? (
                    <Check size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeSection === "profile" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
              <h3 className="text-lg font-semibold dark:text-white mb-4">
                Admin Profile Update
              </h3>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      placeholder="Update Name"
                      className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Login Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Login Email (Admin ID)
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      placeholder="Update Login Email"
                      className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Email (Notifications)
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      value={profile.contactEmail}
                      onChange={(e) =>
                        setProfile({ ...profile, contactEmail: e.target.value })
                      }
                      placeholder="Update Contact Email"
                      className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="tel"
                      value={profile.mobile}
                      onChange={(e) =>
                        setProfile({ ...profile, mobile: e.target.value })
                      }
                      placeholder="Update Mobile Number"
                      className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 my-4"></div>

                {/* Change Password Section */}
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Change Password
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="password"
                        value={profile.newPassword}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Min 8 characters"
                        className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="password"
                        value={profile.confirmPassword}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm new password"
                        className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 my-4"></div>

                {/* Current Password - Required */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="password"
                      value={profile.currentPassword}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Required to save ANY changes"
                      className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleUpdateProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0B2A4A]/90 transition-colors"
                >
                  {loading && success !== "profile" ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : success === "profile" ? (
                    <Check size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  Update Profile
                </button>
              </div>
            </div>
          )}

          {/* Branding & Customization Section */}

          {activeSection === "notifications" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
              <h3 className="text-lg font-semibold dark:text-white mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  {
                    id: "emailAlerts",
                    label: "Email Alerts",
                    desc: "Receive email updates about system activity",
                  },
                  {
                    id: "newLead",
                    label: "New Lead Notifications",
                    desc: "Get notified when a new lead registers",
                  },
                  {
                    id: "weeklyReport",
                    label: "Weekly Reports",
                    desc: "Receive weekly summary of dashboard analytics",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.desc}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.id]}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            [item.id]: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D6A419]/30 dark:peer-focus:ring-[#D6A419]/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0B2A4A]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance Mode Section */}
          {activeSection === "maintenance" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
              <h3 className="text-lg font-semibold dark:text-white mb-4 flex items-center gap-2">
                <Wrench size={20} className="text-[#D6A419]" />
                Maintenance Mode
              </h3>

              {/* Enable/Disable */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Enable Maintenance Mode
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Display maintenance page to all visitors except allowed IPs
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode.enabled}
                    onChange={(e) =>
                      setMaintenanceMode({
                        ...maintenanceMode,
                        enabled: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D6A419]/30 dark:peer-focus:ring-[#D6A419]/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0B2A4A]"></div>
                </label>
              </div>

              {/* Maintenance Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maintenance Message
                </label>
                <textarea
                  value={maintenanceMode.message}
                  onChange={(e) =>
                    setMaintenanceMode({
                      ...maintenanceMode,
                      message: e.target.value,
                    })
                  }
                  placeholder="We are currently performing scheduled maintenance..."
                  rows={4}
                  className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This message will be displayed to visitors during maintenance
                </p>
              </div>

              {/* Allowed IPs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Allowed IP Addresses
                </label>
                <textarea
                  value={maintenanceMode.allowedIPs}
                  onChange={(e) =>
                    setMaintenanceMode({
                      ...maintenanceMode,
                      allowedIPs: e.target.value,
                    })
                  }
                  placeholder="192.168.1.1&#10;10.0.0.1&#10;203.0.113.0"
                  rows={3}
                  className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter one IP address per line. These IPs can access the site
                  during maintenance.
                </p>
              </div>

              {/* Estimated Completion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Completion Time
                </label>
                <input
                  type="datetime-local"
                  value={maintenanceMode.estimatedCompletion}
                  onChange={(e) =>
                    setMaintenanceMode({
                      ...maintenanceMode,
                      estimatedCompletion: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Display when maintenance is expected to complete
                </p>
              </div>

              {/* Show Countdown */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Show Countdown Timer
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Display countdown to estimated completion time
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode.showCountdown}
                    onChange={(e) =>
                      setMaintenanceMode({
                        ...maintenanceMode,
                        showCountdown: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D6A419]/30 dark:peer-focus:ring-[#D6A419]/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0B2A4A]"></div>
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => handleSave("maintenance")}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0B2A4A]/90 transition-colors"
                >
                  {loading && success !== "maintenance" ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : success === "maintenance" ? (
                    <Check size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  Save Maintenance Settings
                </button>
              </div>
            </div>
          )}

          {activeSection === "footer" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
              <h3 className="text-lg font-semibold dark:text-white mb-4 flex items-center gap-2">
                <FileText size={20} className="text-[#D6A419]" />
                Footer Content
              </h3>

              {/* --- BRANDING SECTION MERGED HERE --- */}

              {/* Colors */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Brand Colors
                </h4>
                <ColorPickerComponent
                  label="Primary Color"
                  value={branding.primaryColor}
                  onChange={(value) =>
                    setBranding({ ...branding, primaryColor: value })
                  }
                  description="Main brand color (buttons, links, accents)"
                />
                <ColorPickerComponent
                  label="Secondary Color"
                  value={branding.secondaryColor}
                  onChange={(value) =>
                    setBranding({ ...branding, secondaryColor: value })
                  }
                  description="Secondary brand color (headers, backgrounds)"
                />
              </div>

              <div className="border-t dark:border-gray-700 my-4"></div>

              {/* Logos */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Logos & Images
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Main Logo URL
                  </label>
                  <input
                    type="url"
                    value={branding.logoUrl}
                    onChange={(e) =>
                      setBranding({ ...branding, logoUrl: e.target.value })
                    }
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Logo displayed in the navbar
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Footer Logo URL
                  </label>
                  <input
                    type="url"
                    value={branding.footerLogoUrl}
                    onChange={(e) =>
                      setBranding({
                        ...branding,
                        footerLogoUrl: e.target.value,
                      })
                    }
                    placeholder="https://example.com/footer-logo.png"
                    className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Logo displayed in the footer (optional)
                  </p>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 my-4"></div>

              {/* Footer Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Footer Copyright Text
                </label>
                <input
                  type="text"
                  value={branding.footerText}
                  onChange={(e) =>
                    setBranding({ ...branding, footerText: e.target.value })
                  }
                  placeholder="© 2026 Your Company. All rights reserved."
                  className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="border-t dark:border-gray-700 my-4"></div>

              {/* Social Links */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Social Media Links
                </h4>
                <div className="space-y-4">
                  {branding.socialLinks && branding.socialLinks.length > 0 ? (
                    branding.socialLinks.map((link, index) => (
                      <div
                        key={index}
                        className="flex gap-4 items-start border p-4 rounded-lg dark:border-gray-700 relative"
                      >
                        <button
                          onClick={() => {
                            const newLinks = branding.socialLinks.filter(
                              (_, i) => i !== index,
                            );
                            setBranding({ ...branding, socialLinks: newLinks });
                          }}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Platform Name
                            </label>
                            <input
                              type="text"
                              value={link.platform}
                              onChange={(e) => {
                                const newLinks = [...branding.socialLinks];
                                newLinks[index].platform = e.target.value;
                                setBranding({
                                  ...branding,
                                  socialLinks: newLinks,
                                });
                              }}
                              placeholder="e.g. Facebook"
                              className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg outline-none dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              URL
                            </label>
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => {
                                const newLinks = [...branding.socialLinks];
                                newLinks[index].url = e.target.value;
                                setBranding({
                                  ...branding,
                                  socialLinks: newLinks,
                                });
                              }}
                              placeholder="https://"
                              className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg outline-none dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Icon Name (Lucide)
                            </label>
                            <input
                              type="text"
                              value={link.icon}
                              onChange={(e) => {
                                const newLinks = [...branding.socialLinks];
                                newLinks[index].icon = e.target.value;
                                setBranding({
                                  ...branding,
                                  socialLinks: newLinks,
                                });
                              }}
                              placeholder="e.g. Facebook"
                              className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg outline-none dark:bg-gray-700 dark:text-white"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Case-sensitive name from Lucide React
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No social links added yet.
                    </p>
                  )}

                  <button
                    onClick={() => {
                      const newLinks = [
                        ...(branding.socialLinks || []),
                        { platform: "", url: "", icon: "" },
                      ];
                      setBranding({ ...branding, socialLinks: newLinks });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Plus size={16} /> Add Social Link
                  </button>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 my-4"></div>

              {/* Custom CSS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom CSS (Advanced)
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Add custom CSS to override default styles. Use with caution.
                </p>
                <textarea
                  value={branding.customCSS}
                  onChange={(e) =>
                    setBranding({ ...branding, customCSS: e.target.value })
                  }
                  placeholder=".custom-class { color: red; }"
                  rows={6}
                  className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
                />
              </div>

              <div className="border-t dark:border-gray-700 my-4"></div>

              {/* --- END BRANDING SECTION --- */}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Description
                </label>
                <textarea
                  value={footer.description}
                  onChange={(e) =>
                    setFooter({ ...footer, description: e.target.value })
                  }
                  placeholder="Providing quality computer education..."
                  rows={3}
                  className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Text displayed below the logo in the footer
                </p>
              </div>

              <div className="border-t dark:border-gray-700 my-4"></div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Quick Links
                </h4>
                <div className="space-y-4">
                  {footer.quickLinks && footer.quickLinks.length > 0 ? (
                    footer.quickLinks.map((link, index) => (
                      <div
                        key={index}
                        className="flex gap-4 items-start border p-4 rounded-lg dark:border-gray-700 relative"
                      >
                        <button
                          onClick={() => {
                            const newLinks = footer.quickLinks.filter(
                              (_, i) => i !== index,
                            );
                            setFooter({ ...footer, quickLinks: newLinks });
                          }}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Display Name
                            </label>
                            <input
                              type="text"
                              value={link.name}
                              onChange={(e) => {
                                const newLinks = [...footer.quickLinks];
                                newLinks[index].name = e.target.value;
                                setFooter({ ...footer, quickLinks: newLinks });
                              }}
                              placeholder="e.g. About Us"
                              className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg outline-none dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Link Path / URL
                            </label>
                            <input
                              type="text"
                              value={link.path}
                              onChange={(e) => {
                                const newLinks = [...footer.quickLinks];
                                newLinks[index].path = e.target.value;
                                setFooter({ ...footer, quickLinks: newLinks });
                              }}
                              placeholder="/about"
                              className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg outline-none dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No quick links added.
                    </p>
                  )}
                  <button
                    onClick={() => {
                      const newLinks = [
                        ...(footer.quickLinks || []),
                        { name: "", path: "" },
                      ];
                      setFooter({ ...footer, quickLinks: newLinks });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Plus size={16} /> Add Quick Link
                  </button>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 my-4"></div>

              {/* Courses */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Courses
                </h4>
                <div className="space-y-4">
                  {footer.courses && footer.courses.length > 0 ? (
                    footer.courses.map((link, index) => (
                      <div
                        key={index}
                        className="flex gap-4 items-start border p-4 rounded-lg dark:border-gray-700 relative"
                      >
                        <button
                          onClick={() => {
                            const newLinks = footer.courses.filter(
                              (_, i) => i !== index,
                            );
                            setFooter({ ...footer, courses: newLinks });
                          }}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Course Name
                            </label>
                            <input
                              type="text"
                              value={link.name}
                              onChange={(e) => {
                                const newLinks = [...footer.courses];
                                newLinks[index].name = e.target.value;
                                setFooter({ ...footer, courses: newLinks });
                              }}
                              placeholder="e.g. Web Development"
                              className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg outline-none dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Link Path / URL
                            </label>
                            <input
                              type="text"
                              value={link.path}
                              onChange={(e) => {
                                const newLinks = [...footer.courses];
                                newLinks[index].path = e.target.value;
                                setFooter({ ...footer, courses: newLinks });
                              }}
                              placeholder="/course/web-dev"
                              className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg outline-none dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No courses added.</p>
                  )}
                  <button
                    onClick={() => {
                      const newLinks = [
                        ...(footer.courses || []),
                        { name: "", path: "" },
                      ];
                      setFooter({ ...footer, courses: newLinks });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Plus size={16} /> Add Course
                  </button>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 my-4"></div>

              {/* Contact Information (Shared with Content Section) */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Footer Contact Info
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={content.contactInfo.address}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contactInfo: {
                            ...content.contactInfo,
                            address: e.target.value,
                          },
                        })
                      }
                      placeholder="123 Main St, City, Country"
                      className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={content.contactInfo.phone}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contactInfo: {
                            ...content.contactInfo,
                            phone: e.target.value,
                          },
                        })
                      }
                      placeholder="+1 234 567 8900"
                      className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={content.contactInfo.email}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contactInfo: {
                            ...content.contactInfo,
                            email: e.target.value,
                          },
                        })
                      }
                      placeholder="contact@example.com"
                      className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => handleSave("footer")}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0B2A4A]/90 transition-colors"
                >
                  {loading && success !== "footer" ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : success === "footer" ? (
                    <Check size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  Save Footer Settings
                </button>
              </div>
            </div>
          )}

          {/* Content Management Section */}
          {activeSection === "content" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
              <h3 className="text-lg font-semibold dark:text-white mb-4 flex items-center gap-2">
                <FileText size={20} className="text-[#D6A419]" />
                Content Management
              </h3>

              {/* About Us */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  About Us Page
                </label>
                <textarea
                  value={content.aboutUs}
                  onChange={(e) =>
                    setContent({ ...content, aboutUs: e.target.value })
                  }
                  placeholder="Tell visitors about your organization..."
                  rows={6}
                  className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              <div className="border-t dark:border-gray-700 my-4"></div>

              {/* Privacy Policy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Privacy Policy
                </label>
                <textarea
                  value={content.privacyPolicy}
                  onChange={(e) =>
                    setContent({ ...content, privacyPolicy: e.target.value })
                  }
                  placeholder="Your privacy policy content..."
                  rows={6}
                  className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              <div className="border-t dark:border-gray-700 my-4"></div>

              {/* Terms & Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Terms & Conditions
                </label>
                <textarea
                  value={content.termsAndConditions}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      termsAndConditions: e.target.value,
                    })
                  }
                  placeholder="Your terms and conditions..."
                  rows={6}
                  className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              <div className="border-t dark:border-gray-700 my-4"></div>

              {/* Refund Policy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Refund Policy
                </label>
                <textarea
                  value={content.refundPolicy}
                  onChange={(e) =>
                    setContent({ ...content, refundPolicy: e.target.value })
                  }
                  placeholder="Your refund policy..."
                  rows={6}
                  className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              <div className="border-t dark:border-gray-700 my-4"></div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={content.contactInfo.address}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contactInfo: {
                            ...content.contactInfo,
                            address: e.target.value,
                          },
                        })
                      }
                      placeholder="123 Main St, City, Country"
                      className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={content.contactInfo.phone}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contactInfo: {
                            ...content.contactInfo,
                            phone: e.target.value,
                          },
                        })
                      }
                      placeholder="+1 234 567 8900"
                      className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={content.contactInfo.email}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contactInfo: {
                            ...content.contactInfo,
                            email: e.target.value,
                          },
                        })
                      }
                      placeholder="contact@example.com"
                      className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Google Maps URL
                    </label>
                    <input
                      type="url"
                      value={content.contactInfo.mapUrl}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contactInfo: {
                            ...content.contactInfo,
                            mapUrl: e.target.value,
                          },
                        })
                      }
                      placeholder="https://maps.google.com/..."
                      className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => handleSave("content")}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0B2A4A]/90 transition-colors"
                >
                  {loading && success !== "content" ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : success === "content" ? (
                    <Check size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  Save Content
                </button>
              </div>
            </div>
          )}

          {activeSection === "features" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
              <h3 className="text-lg font-semibold dark:text-white mb-4">
                Feature Flags
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Free Certification
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enable "Certification" menu in Navbar
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        seoSettings.featureFlags?.freeCertification || false
                      }
                      onChange={(e) =>
                        setSeoSettings({
                          ...seoSettings,
                          featureFlags: {
                            ...seoSettings.featureFlags,
                            freeCertification: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D6A419]/30 dark:peer-focus:ring-[#D6A419]/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0B2A4A]"></div>
                  </label>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => handleSave("seo")} // Reusing SEO save logic as it saves seoSettings state
                  className="flex items-center gap-2 px-4 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0B2A4A]/90 transition-colors"
                >
                  {loading && success !== "seo" ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : success === "seo" ? (
                    <Check size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeSection === "seo" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
              <h3 className="text-lg font-semibold dark:text-white mb-4">
                SEO & Analytics Settings
              </h3>

              {/* Meta Tags Section */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Default Meta Tags
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Meta Title
                  </label>
                  <input
                    type="text"
                    value={seoSettings.metaTitle}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        metaTitle: e.target.value,
                      })
                    }
                    placeholder="Your Site Name - Tagline"
                    className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Meta Description
                  </label>
                  <textarea
                    value={seoSettings.metaDescription}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        metaDescription: e.target.value,
                      })
                    }
                    placeholder="Brief description of your site (150-160 characters)"
                    rows={3}
                    className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {seoSettings.metaDescription.length} / 160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={seoSettings.keywords}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        keywords: e.target.value,
                      })
                    }
                    placeholder="keyword1, keyword2, keyword3"
                    className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="border-t dark:border-gray-700 my-4"></div>

              {/* Analytics Section */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Analytics & Tracking
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={seoSettings.googleAnalyticsId}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        googleAnalyticsId: e.target.value,
                      })
                    }
                    placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                    className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Google Tag Manager ID
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Enter your GTM container ID (e.g., GTM-XXXXXXX). The GTM
                    scripts will be automatically injected.
                  </p>
                  <input
                    type="text"
                    value={seoSettings.googleTagManagerId}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        googleTagManagerId: e.target.value,
                      })
                    }
                    placeholder="GTM-XXXXXXX"
                    className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Favicon URL
                  </label>
                  <input
                    type="url"
                    value={seoSettings.faviconUrl}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        faviconUrl: e.target.value,
                      })
                    }
                    placeholder="https://example.com/favicon.ico"
                    className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default OG Image URL
                  </label>
                  <input
                    type="url"
                    value={seoSettings.ogImage}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        ogImage: e.target.value,
                      })
                    }
                    placeholder="https://example.com/og-image.jpg"
                    className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Head Scripts (Google Analytics, etc.)
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Paste your Google Analytics or any custom scripts here. They
                    will be injected into the &lt;head&gt; section of every
                    page.
                  </p>
                  <textarea
                    value={seoSettings.customHeadScripts}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        customHeadScripts: e.target.value,
                      })
                    }
                    placeholder={`<!-- Google tag (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', 'G-XXXXXXXXXX');\n</script>`}
                    rows={8}
                    className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ⚠️ Only paste trusted scripts. Malicious scripts can
                    compromise your site security.
                  </p>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 my-4"></div>

              {/* Cookie Consent Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Cookie size={18} />
                      Cookie Consent Popup
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enable GDPR-compliant cookie notice
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={seoSettings.cookieConsentEnabled}
                      onChange={(e) =>
                        setSeoSettings({
                          ...seoSettings,
                          cookieConsentEnabled: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D6A419]/30 dark:peer-focus:ring-[#D6A419]/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0B2A4A]"></div>
                  </label>
                </div>

                {seoSettings.cookieConsentEnabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cookie Message
                      </label>
                      <textarea
                        value={seoSettings.cookieMessage}
                        onChange={(e) =>
                          setSeoSettings({
                            ...seoSettings,
                            cookieMessage: e.target.value,
                          })
                        }
                        rows={2}
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Accept Button Text
                        </label>
                        <input
                          type="text"
                          value={seoSettings.cookieButtonText}
                          onChange={(e) =>
                            setSeoSettings({
                              ...seoSettings,
                              cookieButtonText: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Privacy Policy URL
                        </label>
                        <input
                          type="text"
                          value={seoSettings.privacyPolicyUrl}
                          onChange={(e) =>
                            setSeoSettings({
                              ...seoSettings,
                              privacyPolicyUrl: e.target.value,
                            })
                          }
                          placeholder="/privacy-policy"
                          className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D6A419] outline-none dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => handleSave("seo")}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0B2A4A]/90 transition-colors"
                >
                  {loading && success !== "seo" ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : success === "seo" ? (
                    <Check size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  Save SEO Settings
                </button>
              </div>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
              <h3 className="text-lg font-semibold dark:text-white mb-4">
                Appearance
              </h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-4">
                  {darkMode ? <Moon size={24} /> : <Sun size={24} />}
                  <div>
                    <h3 className="font-medium dark:text-white">Theme Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Toggle between light and dark themes
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    darkMode ? "bg-[#0B2A4A]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      darkMode ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
