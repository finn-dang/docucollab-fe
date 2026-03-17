"use client";

import { useState, useEffect } from "react";
import userAdminService, {
  AdminUser,
  CreateUserDto,
  UpdateUserDto,
} from "@/lib/services/user.admin.service";
import { roleService, Role } from "@/lib/services/role.service";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: AdminUser | null;
}

export default function UserFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: UserFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    displayName: "",
    password: "",
    phone: "",
    address: "",
    startDate: "",
    selectedRoleIds: [] as string[], // ✅ Array for multiple roles
  });

  const isEditMode = !!initialData;

  // Fetch roles for dropdown
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await roleService.getAll();
        setRoles(rolesData);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  // Reset and populate form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          username: initialData.username ?? "",
          email: initialData.email ?? "",
          displayName: initialData.displayName ?? "",
          password: "",
          phone: initialData.phone ?? "",
          address: initialData.address ?? "",
          startDate: initialData.startDate?.split("T")[0] ?? "",
          selectedRoleIds: initialData.roles?.map((r) => r.id) ?? [],
        });
      } else {
        setFormData({
          username: "",
          email: "",
          displayName: "",
          password: "",
          phone: "",
          address: "",
          startDate: "",
          selectedRoleIds: [],
        });
      }
    }
    setLoading(false);
  }, [isOpen, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedRoleIds: prev.selectedRoleIds.includes(roleId)
        ? prev.selectedRoleIds.filter((id) => id !== roleId)
        : [...prev.selectedRoleIds, roleId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.username.trim()) {
      alert("Username is required");
      return;
    }
    if (!formData.email.trim()) {
      alert("Email is required");
      return;
    }
    if (!formData.displayName.trim()) {
      alert("Display name is required");
      return;
    }
    if (!isEditMode && !formData.password.trim()) {
      alert("Password is required for new users");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && initialData) {
        const updateData: UpdateUserDto = {
          username: formData.username,
          email: formData.email,
          displayName: formData.displayName,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          startDate: formData.startDate || undefined,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        // Update roles if changed
        if (
          JSON.stringify(formData.selectedRoleIds) !==
          JSON.stringify(initialData.roles?.map((r) => r.id))
        ) {
          updateData.roleIds = formData.selectedRoleIds;
        }
        await userAdminService.update(initialData.id, updateData);
      } else {
        const createData: CreateUserDto = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          startDate: formData.startDate || undefined,
          roleIds: formData.selectedRoleIds.length > 0 ? formData.selectedRoleIds : undefined,
        };
        await userAdminService.create(createData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save user:", error);
      alert(`Failed to ${isEditMode ? "update" : "create"} user. Please try again.`);
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
                {isEditMode ? "Edit User" : "Create New User"}
              </h2>
              <p className="text-purple-100 text-sm mt-1">
                {isEditMode ? "Update user information" : "Add a new user to the system"}
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
        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="e.g., johndoe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="e.g., john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="e.g., John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Roles</label>
              <div className="space-y-2 border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                {roles.length === 0 ? (
                  <p className="text-sm text-gray-400">No roles available</p>
                ) : (
                  roles.map((role) => (
                    <label key={role.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.selectedRoleIds.includes(role.id)}
                        onChange={() => handleRoleToggle(role.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{role.name}</span>
                    </label>
                  ))
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                If no role selected, default "user" role will be assigned
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password {!isEditMode && <span className="text-red-500">*</span>}
                {isEditMode && (
                  <span className="text-gray-400 text-xs ml-1">(Leave blank to keep current)</span>
                )}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditMode}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder={
                  isEditMode
                    ? "Enter new password (optional)"
                    : "Enter password (min. 6 characters)"
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone
                <span className="text-gray-400 text-xs ml-1">(Optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="e.g., +84 123 456 789"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Address
                <span className="text-gray-400 text-xs ml-1">(Optional)</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition resize-none"
                placeholder="Enter user's address"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Start Date
                <span className="text-gray-400 text-xs ml-1">(Optional)</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
                "Update User"
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
