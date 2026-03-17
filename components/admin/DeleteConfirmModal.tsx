// components/document/DeleteConfirmModal.tsx
"use client";

import { Trash2, AlertTriangle, X, Archive, RotateCcw } from "lucide-react";
import { useEffect } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string | React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  type?: "soft" | "permanent" | "default";
  itemName?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  title = "Delete Document",
  message,
  onClose,
  onConfirm,
  isDeleting = false,
  type = "default",
  itemName,
}: DeleteConfirmModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "soft":
        return {
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          buttonBg: "bg-amber-600 hover:bg-amber-700",
          buttonText: "Move to Trash",
          Icon: Archive,
        };
      case "permanent":
        return {
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          buttonBg: "bg-red-600 hover:bg-red-700",
          buttonText: "Permanently Delete",
          Icon: Trash2,
        };
      default:
        return {
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          buttonBg: "bg-red-600 hover:bg-red-700",
          buttonText: "Delete",
          Icon: Trash2,
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.Icon;

  const defaultMessage = () => {
    if (type === "soft") {
      return itemName
        ? `Are you sure you want to move "${itemName}" to trash? You can restore it later.`
        : `Are you sure you want to move this item to trash? You can restore it later.`;
    }
    if (type === "permanent") {
      return itemName
        ? `Are you sure you want to permanently delete "${itemName}"? This action cannot be undone.`
        : `Are you sure you want to permanently delete this item? This action cannot be undone.`;
    }
    return itemName
      ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      : `Are you sure you want to delete this item? This action cannot be undone.`;
  };

  return (
    <>
      {/* Backdrop with animation */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in"
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 animate-in zoom-in-95 fade-in slide-in-from-bottom-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className={`${styles.iconBg} rounded-full p-3 animate-in zoom-in duration-200`}>
                <IconComponent className={`w-7 h-7 ${styles.iconColor}`} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">{title}</h2>

            {/* Message */}
            <div className="text-center text-gray-600 mb-6">{message || defaultMessage()}</div>

            {/* Warning for permanent deletion */}
            {type === "permanent" && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-semibold mb-1">Warning: Permanent Action</p>
                  <p>
                    This item will be completely removed from the system and cannot be recovered.
                  </p>
                </div>
              </div>
            )}

            {/* Info for soft deletion */}
            {type === "soft" && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                <RotateCcw className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-700">
                  <p className="font-semibold mb-1">Recoverable Action</p>
                  <p>
                    This item will be moved to trash. You can restore it from the admin panel within
                    30 days.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className={`px-5 py-2.5 ${styles.buttonBg} text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm hover:shadow-md`}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <IconComponent className="w-4 h-4" />
                    {styles.buttonText}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind animations - add to your global.css if not present */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes zoom-in-95 {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slide-in-from-bottom-4 {
          from {
            transform: translateY(1rem);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-in {
          animation-duration: 0.2s;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .zoom-in-95 {
          animation-name: zoom-in-95;
        }
        .slide-in-from-bottom-4 {
          animation-name: slide-in-from-bottom-4;
        }
      `}</style>
    </>
  );
}
