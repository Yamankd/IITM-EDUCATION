import React, { createContext, useContext, useState, useCallback } from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmContext = createContext();

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context;
};

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "warning", // warning, danger, info
  });

  const showConfirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title: options.title || "Confirm Action",
        message: options.message || "Are you sure?",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        type: options.type || "warning",
        onConfirm: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        },
      });
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ConfirmContext.Provider value={{ showConfirm, hideConfirm }}>
      {children}
      {confirmState.isOpen && <ConfirmDialog {...confirmState} />}
    </ConfirmContext.Provider>
  );
};

const ConfirmDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  type,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: "text-red-500",
          confirmBtn: "bg-red-600 hover:bg-red-700 text-white",
        };
      case "info":
        return {
          icon: "text-[#0B2A4A]",
          confirmBtn: "bg-[#D6A419] hover:bg-[#c49416] text-[#0B2A4A]",
        };
      case "warning":
      default:
        return {
          icon: "text-yellow-500",
          confirmBtn: "bg-[#D6A419] hover:bg-[#c49416] text-[#0B2A4A]",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      ></div>

      {/* Dialog */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 animate-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#0B2A4A] px-6 py-4 rounded-t-lg">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className={styles.icon} size={24} />
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition-colors font-bold ${styles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
