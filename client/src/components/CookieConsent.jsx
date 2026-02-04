import React, { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState({
    enabled: true,
    message:
      "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.",
    buttonText: "Accept",
    privacyPolicyUrl: "/privacy-policy",
  });

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookieConsent");

    // Load settings from localStorage (set by admin)
    const savedSettings = localStorage.getItem("seoSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({
          enabled: parsed.cookieConsentEnabled ?? true,
          message: parsed.cookieMessage || settings.message,
          buttonText: parsed.cookieButtonText || settings.buttonText,
          privacyPolicyUrl:
            parsed.privacyPolicyUrl || settings.privacyPolicyUrl,
        });
      } catch (e) {
        console.error("Error parsing SEO settings:", e);
      }
    }

    // Show popup if enabled and not yet accepted
    if (!hasAccepted && settings.enabled) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
  };

  if (!isVisible || !settings.enabled) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-800 border-t-2 border-[#D6A419] shadow-2xl animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="text-[#D6A419] flex-shrink-0 mt-1" size={24} />
          <div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {settings.message}
              {settings.privacyPolicyUrl && (
                <>
                  {" "}
                  <a
                    href={settings.privacyPolicyUrl}
                    className="text-[#0B2A4A] dark:text-[#D6A419] underline hover:no-underline"
                  >
                    Learn more
                  </a>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm font-medium"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-[#D6A419] text-white rounded-lg hover:bg-[#D6A419]/90 transition-colors text-sm font-medium shadow-md"
          >
            {settings.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
