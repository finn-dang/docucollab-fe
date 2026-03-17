"use client";

import { useState, useEffect } from "react";
import menuService, { CreateMenuDto, UpdateMenuDto, Menu } from "@/lib/services/menu.service";

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Menu | null;
}

export default function MenuFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: MenuFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateMenuDto>({
    name: "",
    label: "",
    description: "",
    icon: "",
    path: "",
    type: "",
    isActive: true,
    hidden: false,
  });

  const isEditMode = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name ?? "",
          label: initialData.label ?? "",
          description: initialData.description ?? "",
          icon: initialData.icon ?? "",
          path: initialData.path ?? "",
          type: initialData.type ?? "",
          isActive: initialData.isActive ?? true,
          hidden: initialData.hidden ?? false,
        });
      } else {
        setFormData({
          name: "",
          label: "",
          description: "",
          icon: "",
          path: "",
          type: "",
          isActive: true,
          hidden: false,
        });
      }
    }
    setLoading(false);
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.label.trim() ||
      !formData.path.trim() ||
      !formData.type.trim()
    ) {
      alert("Please fill in all required fields (Name, Label, Path, Type).");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && initialData) {
        const updateData: UpdateMenuDto = {
          name: formData.name,
          label: formData.label,
          description: formData.description || undefined,
          icon: formData.icon || undefined,
          path: formData.path,
          type: formData.type,
          isActive: formData.isActive,
          hidden: formData.hidden,
        };
        await menuService.update(initialData.id, updateData);
      } else {
        await menuService.create(formData as CreateMenuDto);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save menu:", error);
      alert(`Failed to ${isEditMode ? "update" : "create"} menu. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">
                {isEditMode ? "Edit Menu" : "Create New Menu"}
              </h2>
              <p className="text-purple-100 text-sm mt-1">
                {isEditMode ? "Update menu information" : "Add a new menu item to the system"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Name <span className="text-purple-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-gray-900 placeholder-gray-400"
                placeholder="e.g., dashboard"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Label <span className="text-purple-600">*</span>
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-gray-900 placeholder-gray-400"
                placeholder="e.g., Dashboard"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-gray-900 placeholder-gray-400 resize-none"
                placeholder="Brief description of the menu"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Icon</label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-gray-900 placeholder-gray-400"
                placeholder="e.g., HomeOutlined, DashboardOutlined"
              />
              <p className="text-xs text-gray-400 mt-1">
                Icon name from Ant Design or your icon library
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Path <span className="text-purple-600">*</span>
              </label>
              <input
                type="text"
                name="path"
                value={formData.path}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-gray-900 placeholder-gray-400"
                placeholder="e.g., /dashboard"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Type <span className="text-purple-600">*</span>
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-gray-900 placeholder-gray-400"
                placeholder="e.g., route, link, dropdown"
              />
            </div>

            <div className="flex items-center space-x-6 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="hidden"
                  checked={formData.hidden}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Hidden</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : isEditMode ? (
                "Update Menu"
              ) : (
                "Create Menu"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
