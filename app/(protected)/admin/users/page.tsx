"use client";

import { useEffect, useState } from "react";
import userAdminService, {
  AdminUser,
  SearchUsersParams,
  SearchUsersResponse,
} from "@/lib/services/user.admin.service";
import UserFormModal from "@/components/admin/UserFormModal";
import UserRoleModal from "@/components/admin/UserRoleModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import {
  Users,
  Plus,
  Search,
  X,
  Edit,
  Trash2,
  Shield,
  Mail,
  User,
  Calendar,
  MoreVertical,
  Grid,
  Table,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Activity,
  Crown,
  Star,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<SearchUsersResponse["meta"]>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  // Search filters
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    withRoles: 0,
  });

  const fetchUsers = async (
    page: number,
    limit: number,
    usernameFilter?: string,
    emailFilter?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params: SearchUsersParams = { page, limit };
      if (usernameFilter) params.username = usernameFilter;
      if (emailFilter) params.email = emailFilter;
      const response = await userAdminService.search(params);
      setUsers(response.data);
      setMeta(response.meta);

      // Calculate stats
      const activeCount = response.data.filter((u) => u.isActive).length;
      const withRolesCount = response.data.filter((u) => u.roles && u.roles.length > 0).length;
      setStats({
        total: response.meta.totalItems,
        active: activeCount,
        inactive: response.data.length - activeCount,
        withRoles: withRolesCount,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(meta.page, meta.limit, username, email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    setUsername(tempUsername);
    setEmail(tempEmail);
    fetchUsers(1, meta.limit, tempUsername, tempEmail);
  };

  const handleReset = () => {
    setTempUsername("");
    setTempEmail("");
    setUsername("");
    setEmail("");
    fetchUsers(1, meta.limit, "", "");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.totalPages) return;
    fetchUsers(newPage, meta.limit, username, email);
  };

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleChangeRole = (user: AdminUser) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const handleDelete = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await userAdminService.deleteUser(selectedUser.id);
      fetchUsers(meta.page, meta.limit, username, email);
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleModalSuccess = () => {
    fetchUsers(meta.page, meta.limit, username, email);
  };

  const getRoleNames = (user: AdminUser) => {
    if (!user.roles || user.roles.length === 0) return "—";
    return user.roles.map((role: any) => role.name).join(", ");
  };

  const getInitials = (user: AdminUser) => {
    const name = user.displayName || user.username;
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const getRandomGradient = (username: string) => {
    const gradients = [
      "from-pink-500 to-rose-500",
      "from-purple-500 to-indigo-500",
      "from-blue-500 to-cyan-500",
      "from-emerald-500 to-teal-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
    ];
    const index = username.length % gradients.length;
    return gradients[index];
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="w-full px-3 sm:px-5 py-6 md:py-8">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 animate-pulse" />
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
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
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl shadow-xl p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                    <Users className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
                </div>
                <p className="text-purple-100 text-sm md:text-base">
                  Manage system users, assign roles, and control access
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex bg-white/20 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      viewMode === "cards"
                        ? "bg-white text-purple-600 shadow"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      viewMode === "table"
                        ? "bg-white text-purple-600 shadow"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <Table className="w-4 h-4" />
                    Table
                  </button>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="group bg-white text-purple-600 hover:bg-purple-50 font-medium py-2 px-5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-3 text-white shadow-md">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-gray-400">
              <Activity className="w-3 h-3 mr-1" />
              <span>Across all roles</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Active Users</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-3 text-white shadow-md">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${stats.total ? (stats.active / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">With Roles</p>
                <p className="text-3xl font-bold text-blue-600">{stats.withRoles}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-3 text-white shadow-md">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-gray-400">
              <Crown className="w-3 h-3 mr-1" />
              <span>Assigned permissions</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Inactive</p>
                <p className="text-3xl font-bold text-orange-600">{stats.inactive}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-3 text-white shadow-md">
                <UserX className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-gray-400">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Needs attention</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by username or email..."
                value={tempUsername || tempEmail}
                onChange={(e) => {
                  setTempUsername(e.target.value);
                  setTempEmail(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-3 border-2 border-gray-200 rounded-xl hover:border-purple-500 transition-all flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(username || email) && (
                <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-0.5">
                  Active
                </span>
              )}
            </button>

            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Search
            </button>

            <button
              onClick={handleReset}
              className="px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
            >
              Reset
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Filter by username"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="text"
                  placeholder="Filter by email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-red-800">Error Loading Users</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={() => fetchUsers(meta.page, meta.limit, username, email)}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content: Cards View */}
        {viewMode === "cards" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className="group bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Card Header */}
                  <div
                    className={`bg-gradient-to-r ${getRandomGradient(user.username)} p-5 relative overflow-hidden`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold text-xl shadow-md">
                        {getInitials(user)}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {user.displayName || user.username}
                    </h3>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span>@{user.username}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>

                    {/* Roles Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.slice(0, 3).map((role: any) => (
                          <span
                            key={role.id}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700"
                          >
                            <Star className="w-3 h-3" />
                            {role.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No roles assigned</span>
                      )}
                      {user.roles && user.roles.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
                          +{user.roles.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleChangeRole(user)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-all text-sm font-medium"
                      >
                        <Shield className="w-4 h-4" />
                        Roles
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-all text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {users.length === 0 && !loading && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
                <p className="text-gray-500">
                  {username || email
                    ? "No users match your search criteria"
                    : "Create your first user to get started"}
                </p>
              </div>
            )}
          </>
        )}

        {/* Content: Table View */}
        {viewMode === "table" && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-purple-50 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full bg-gradient-to-r ${getRandomGradient(user.username)} flex items-center justify-center text-white text-xs font-bold`}
                          >
                            {getInitials(user)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.displayName || user.username}
                            </div>
                            <div className="text-xs text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex flex-wrap gap-1">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.slice(0, 2).map((role: any) => (
                              <span
                                key={role.id}
                                className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs"
                              >
                                {role.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                          {user.roles && user.roles.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              +{user.roles.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.isActive ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleChangeRole(user)}
                            className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Change Role"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && !loading && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">No users found</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium text-gray-900">{(meta.page - 1) * meta.limit + 1}</span>{" "}
              to{" "}
              <span className="font-medium text-gray-900">
                {Math.min(meta.page * meta.limit, meta.totalItems)}
              </span>{" "}
              of <span className="font-medium text-gray-900">{meta.totalItems}</span> users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page === 1}
                className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                  let pageNum;
                  if (meta.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (meta.page <= 3) {
                    pageNum = i + 1;
                  } else if (meta.page >= meta.totalPages - 2) {
                    pageNum = meta.totalPages - 4 + i;
                  } else {
                    pageNum = meta.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        meta.page === pageNum
                          ? "bg-purple-600 text-white shadow-md"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page === meta.totalPages}
                className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      {selectedUser && (
        <>
          <UserFormModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
            onSuccess={handleModalSuccess}
            initialData={selectedUser}
          />
          <UserRoleModal
            isOpen={isRoleModalOpen}
            onClose={() => {
              setIsRoleModalOpen(false);
              setSelectedUser(null);
            }}
            userId={selectedUser.id}
            currentRoleIds={selectedUser.roles?.map((r: any) => r.id) || []}
            onSuccess={handleModalSuccess}
          />
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedUser(null);
            }}
            onConfirm={handleConfirmDelete}
            title="Delete User"
            type="permanent"
            itemName={selectedUser.username}
            message={`Are you sure you want to delete user "${selectedUser.username}"? This action cannot be undone and will remove all user data.`}
          />
        </>
      )}
    </div>
  );
}
