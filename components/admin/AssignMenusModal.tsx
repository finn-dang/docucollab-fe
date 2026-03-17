"use client";

import { useEffect, useState } from "react";
import menuService, { Menu } from "@/lib/services/menu.service";
import roleService from "@/lib/services/role.service";

interface AssignMenusModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
  roleName: string;
  onSuccess: () => void;
}

export default function AssignMenusModal({
  isOpen,
  onClose,
  roleId,
  roleName,
  onSuccess,
}: AssignMenusModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);

  // Fetch all menus and current role menus when modal opens
  useEffect(() => {
    if (!isOpen || !roleId) return;

    const fetchData = async () => {
      setFetching(true);
      try {
        const [allMenus, role] = await Promise.all([
          menuService.getAll(),
          roleService.getById(roleId),
        ]);
        setMenus(allMenus);
        const currentMenuIds = role.menus?.map((m: any) => m.id) || [];
        setSelectedMenuIds(currentMenuIds);
      } catch (error) {
        console.error("Failed to load menus or role:", error);
        alert("Failed to load data. Please try again.");
        onClose();
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [isOpen, roleId, onClose]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMenus([]);
      setSelectedMenuIds([]);
      setFetching(true);
    }
  }, [isOpen]);

  const toggleMenu = (menuId: string) => {
    setSelectedMenuIds((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await roleService.updateMenus(roleId, selectedMenuIds);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to assign menus:", error);
      alert("Failed to assign menus. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Assign Menus</h2>
            <p className="text-sm text-gray-500 mt-1">
              Role: <span className="font-medium text-gray-700">{roleName}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {fetching ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : menus.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No menus available.</p>
          ) : (
            <div className="space-y-2">
              {menus.map((menu) => (
                <label
                  key={menu.id}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedMenuIds.includes(menu.id)}
                    onChange={() => toggleMenu(menu.id)}
                    className="mt-0.5 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{menu.label}</div>
                    {menu.path && <div className="text-sm text-gray-500">{menu.path}</div>}
                    {menu.description && (
                      <div className="text-xs text-gray-400 mt-0.5">{menu.description}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || fetching}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            ) : (
              "Save Menus"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
