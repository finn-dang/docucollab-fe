"use client";

import { useEffect, useState } from "react";
import { roleService, Role } from "@/lib/services/role.service";
import RoleFormModal from "@/components/admin/RoleFormModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import AssignMenusModal from "@/components/admin/AssignMenusModal";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Menu as MenuIcon,
  MoreVertical,
  Users,
  CheckCircle,
  AlertCircle,
  Search,
  X,
  Layers,
  Eye,
} from "lucide-react";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleForMenu, setSelectedRoleForMenu] = useState<Role | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Stats
  const [stats, setStats] = useState({ totalRoles: 0, totalMenusAssigned: 0 });

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roleService.getAll();
      setRoles(data);
      setFilteredRoles(data);

      // Calculate stats
      const totalMenus = data.reduce((sum, role) => sum + (role.menus?.length || 0), 0);
      setStats({
        totalRoles: data.length,
        totalMenusAssigned: totalMenus,
      });
    } catch (err) {
      setError("Failed to load roles. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Filter roles based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRoles(roles);
    } else {
      const filtered = roles.filter(
        (role) =>
          role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredRoles(filtered);
    }
  }, [searchQuery, roles]);

  const handleDeleteClick = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRole) return;
    try {
      await roleService.deleteRole(selectedRole.id);
      await fetchRoles();
    } catch (err) {
      alert("Failed to delete role");
      console.error(err);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedRole(null);
    }
  };

  const handleAssignClick = (role: Role) => {
    setSelectedRole(role);
    setIsAssignModalOpen(true);
  };

  const handleAssignSuccess = () => {
    fetchRoles();
  };

  const getRoleColor = (roleName: string) => {
    const colors = {
      admin: "from-purple-500 to-pink-500",
      editor: "from-blue-500 to-indigo-500",
      viewer: "from-green-500 to-emerald-500",
      manager: "from-orange-500 to-red-500",
    };
    const lowerName = roleName.toLowerCase();
    if (lowerName.includes("admin")) return colors.admin;
    if (lowerName.includes("edit")) return colors.editor;
    if (lowerName.includes("view")) return colors.viewer;
    if (lowerName.includes("manage")) return colors.manager;
    return "from-gray-500 to-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="w-full px-3 sm:px-5 py-6 md:py-8">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600 animate-pulse" />
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading roles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="w-full px-3 sm:px-5 py-6 md:py-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl shadow-xl p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                    <Shield className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">Role Management</h1>
                </div>
                <p className="text-purple-100 text-sm md:text-base">
                  Manage user roles, permissions, and menu assignments
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="group bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Create New Role
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Roles</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRoles}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-3 text-white shadow-md">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-gray-400">
              <span>System-wide roles</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Menu Assignments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalMenusAssigned}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-3 text-white shadow-md">
                <MenuIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-gray-400">
              <span>Total menu permissions</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Avg. Menus/Role</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalRoles ? (stats.totalMenusAssigned / stats.totalRoles).toFixed(1) : 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-3 text-white shadow-md">
                <Layers className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-gray-400">
              <span>Average per role</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Roles Grid/Cards View */}
        {filteredRoles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Shield className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No roles found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? "No roles match your search criteria"
                : "Create your first role to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Role
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredRoles.map((role, index) => (
              <div
                key={role.id}
                className="group bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Role Header */}
                <div
                  className={`bg-gradient-to-r ${getRoleColor(role.name)} p-5 text-white relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{role.name}</h3>
                        <p className="text-white/80 text-xs mt-0.5">
                          {role.menus?.length || 0} menu permissions
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <button className="text-white/80 hover:text-white p-1">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Role Body */}
                <div className="p-5">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 min-h-[60px]">
                    {role.description || "No description provided"}
                  </p>

                  {/* Menu Tags Preview */}
                  {role.menus && role.menus.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                        <MenuIcon className="w-3 h-3" />
                        Assigned Menus
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {role.menus.slice(0, 3).map((menu) => (
                          <span
                            key={menu.id}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-lg"
                          >
                            <CheckCircle className="w-3 h-3" />
                            {menu.name}
                          </span>
                        ))}
                        {role.menus.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                            +{role.menus.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleAssignClick(role)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      <MenuIcon className="w-4 h-4" />
                      Assign Menus
                    </button>
                    <button
                      onClick={() => handleDeleteClick(role)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Footer */}
        {filteredRoles.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>
                  Showing {filteredRoles.length} of {roles.length} roles
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span>Total permissions: {stats.totalMenusAssigned}</span>
                <span className="text-gray-300">|</span>
                <span>System ready</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <RoleFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchRoles}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Role"
        type="permanent"
        itemName={selectedRole?.name}
        message={`Are you sure you want to delete the role "${selectedRole?.name}"? This will remove all permissions associated with this role and cannot be undone.`}
      />

      {selectedRole && (
        <AssignMenusModal
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedRole(null);
          }}
          roleId={selectedRole.id}
          roleName={selectedRole.name}
          onSuccess={handleAssignSuccess}
        />
      )}
    </div>
  );
}
