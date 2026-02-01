import React from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useAlert } from "../context/AlertContext";

const CustomAlert = () => {
  const { alerts, removeAlert } = useAlert();

  const getAlertStyles = (type) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-500",
          text: "text-green-800 dark:text-green-200",
          icon: <CheckCircle className="text-green-500" size={24} />,
        };
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-500",
          text: "text-red-800 dark:text-red-200",
          icon: <AlertCircle className="text-red-500" size={24} />,
        };
      case "warning":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-500",
          text: "text-yellow-800 dark:text-yellow-200",
          icon: <AlertTriangle className="text-yellow-500" size={24} />,
        };
      case "info":
      default:
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-[#0B2A4A]",
          text: "text-[#0B2A4A] dark:text-blue-200",
          icon: (
            <Info className="text-[#0B2A4A] dark:text-blue-400" size={24} />
          ),
        };
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] space-y-3 max-w-md">
      {alerts.map((alert) => {
        const styles = getAlertStyles(alert.type);

        return (
          <div
            key={alert.id}
            className={`${styles.bg} ${styles.border} border-l-4 p-4 rounded-lg shadow-lg animate-in slide-in-from-right duration-300 flex items-start gap-3`}
          >
            <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
            <div className={`flex-1 ${styles.text} text-sm font-medium`}>
              {alert.message}
            </div>
            <button
              onClick={() => removeAlert(alert.id)}
              className={`flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity`}
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default CustomAlert;
