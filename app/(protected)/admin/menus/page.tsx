"use client";

import { useEffect, useState } from "react";
import { menuService, Menu } from "@/lib/services/menu.service";
import MenuFormModal from "@/components/admin/MenuFormModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import {
  Menu as MenuIcon,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  FolderTree,
  Link as LinkIcon,
  Hash,
  Eye,
  EyeOff,
  Layers,
  Home,
  Settings,
  Users,
  Shield,
  FileText,
  FolderOpen,
  Grid3x3,
  AlertCircle,
  CheckCircle,
  Info,
  Clock,
  Type,
  FileCode,
  LucideIcon,
  List,
  LayoutGrid,
  Calendar,
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  home: Home,
  settings: Settings,
  users: Users,
  shield: Shield,
  file: FileText,
  folder: FolderOpen,
  menu: MenuIcon,
  grid: Grid3x3,
  hash: Hash,
  link: LinkIcon,
  type: Type,
  code: FileCode,
  list: List,
  layout: LayoutGrid,
};

const getIconComponent = (iconName?: string): LucideIcon => {
  if (iconName && iconMap[iconName.toLowerCase()]) {
    return iconMap[iconName.toLowerCase()];
  }
  return LinkIcon;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "hidden">("all");
  const [sortBy, setSortBy] = useState<"name" | "label" | "type" | "createdAt">("label");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalMenus: 0,
    activeMenus: 0,
    inactiveMenus: 0,
    hiddenMenus: 0,
    visibleMenus: 0,
    types: {} as Record<string, number>,
  });

  const fetchMenus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await menuService.getAll();
      setMenus(data);
      setFilteredMenus(data);

      // Calculate stats
      const activeCount = data.filter((menu) => menu.isActive && !menu.hidden).length;
      const inactiveCount = data.filter((menu) => !menu.isActive && !menu.hidden).length;
      const hiddenCount = data.filter((menu) => menu.hidden).length;
      const visibleCount = data.filter((menu) => !menu.hidden).length;

      // Count by type
      const typeCounts: Record<string, number> = {};
      data.forEach((menu) => {
        if (menu.type) {
          typeCounts[menu.type] = (typeCounts[menu.type] || 0) + 1;
        }
      });

      setStats({
        totalMenus: data.length,
        activeMenus: activeCount,
        inactiveMenus: inactiveCount,
        hiddenMenus: hiddenCount,
        visibleMenus: visibleCount,
        types: typeCounts,
      });
    } catch (err) {
      setError("Failed to load menus. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // Filter and sort menus based on search and filters
  useEffect(() => {
    let filtered = [...menus];

    // Search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (menu) =>
          menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          menu.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (menu.description &&
            menu.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (menu.path && menu.path.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (menu.icon && menu.icon.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((menu) => menu.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((menu) => {
        if (statusFilter === "active") return menu.isActive && !menu.hidden;
        if (statusFilter === "inactive") return !menu.isActive && !menu.hidden;
        if (statusFilter === "hidden") return menu.hidden;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "label") return a.label.localeCompare(b.label);
      if (sortBy === "type") return (a.type || "").localeCompare(b.type || "");
      if (sortBy === "createdAt") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });

    setFilteredMenus(filtered);
  }, [searchQuery, typeFilter, statusFilter, sortBy, menus]);

  const handleEditClick = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsFormModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedMenu(null);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMenu) return;
    try {
      await menuService.deleteMenu(selectedMenu.id);
      await fetchMenus();
    } catch (err) {
      alert("Failed to delete menu");
      console.error(err);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedMenu(null);
    }
  };

  const handleFormSuccess = () => {
    fetchMenus();
  };

  const getUniqueTypes = () => {
    const types = new Set<string>();
    menus.forEach((menu) => {
      if (menu.type) types.add(menu.type);
    });
    return Array.from(types).sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="w-full px-3 sm:px-5 py-6 md:py-8">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MenuIcon className="w-6 h-6 text-purple-600 animate-pulse" />
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading menu structure...</p>
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
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-xl p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                    <FolderTree className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">Menu Management</h1>
                </div>
                <p className="text-emerald-100 text-sm md:text-base">
                  Organize navigation structure, manage menu items, and control visibility
                </p>
              </div>
              <button
                onClick={handleCreateClick}
                className="group bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Create Menu
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Menus</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalMenus}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-3 text-white shadow-md">
                <MenuIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Active & Visible</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeMenus}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-3 text-white shadow-md">
                <Eye className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${stats.totalMenus ? (stats.activeMenus / stats.totalMenus) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Hidden Menus</p>
                <p className="text-3xl font-bold text-orange-600">{stats.hiddenMenus}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-3 text-white shadow-md">
                <EyeOff className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Menu Types</p>
                <p className="text-3xl font-bold text-blue-600">
                  {Object.keys(stats.types).length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-3 text-white shadow-md">
                <Layers className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search menus by name, label, path, description, or icon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none bg-white"
            >
              <option value="all">All Types</option>
              {getUniqueTypes().map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active & Visible</option>
              <option value="inactive">Inactive</option>
              <option value="hidden">Hidden</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none bg-white"
            >
              <option value="label">Sort by Label</option>
              <option value="name">Sort by Name</option>
              <option value="type">Sort by Type</option>
              <option value="createdAt">Sort by Date</option>
            </select>

            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  viewMode === "grid"
                    ? "bg-white text-emerald-600 shadow"
                    : "text-gray-600 hover:bg-white/50"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  viewMode === "list"
                    ? "bg-white text-emerald-600 shadow"
                    : "text-gray-600 hover:bg-white/50"
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
          </div>

          {/* Filter Tags */}
          {(typeFilter !== "all" || statusFilter !== "all" || searchQuery) && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
              {typeFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-lg">
                  Type: {typeFilter}
                  <button
                    onClick={() => setTypeFilter("all")}
                    className="ml-1 hover:text-emerald-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-lg">
                  Status:{" "}
                  {statusFilter === "active"
                    ? "Active"
                    : statusFilter === "inactive"
                      ? "Inactive"
                      : "Hidden"}
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="ml-1 hover:text-emerald-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-lg">
                  Search: {searchQuery}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 hover:text-emerald-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Menu Grid View */}
        {viewMode === "grid" && (
          <>
            {filteredMenus.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <MenuIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No menus found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                    ? "No menus match your filter criteria"
                    : "Create your first menu to get started"}
                </p>
                {!searchQuery && typeFilter === "all" && statusFilter === "all" && (
                  <button
                    onClick={handleCreateClick}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Menu
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredMenus.map((menu, index) => {
                  const IconComponent = getIconComponent(menu.icon);
                  return (
                    <div
                      key={menu.id}
                      className={`group bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 ${
                        menu.hidden ? "border-orange-200 bg-orange-50/30" : "border-gray-100"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`p-2.5 rounded-xl ${
                              menu.isActive && !menu.hidden
                                ? "bg-emerald-100 text-emerald-600"
                                : menu.hidden
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditClick(menu)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(menu)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{menu.label}</h3>
                          <p className="text-xs text-gray-500 mt-0.5 font-mono">{menu.name}</p>

                          {menu.path && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                              <Hash className="w-3 h-3" />
                              <span className="truncate">{menu.path}</span>
                            </div>
                          )}

                          {menu.description && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                              {menu.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {menu.type && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                              <Type className="w-3 h-3" />
                              {menu.type}
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              menu.isActive && !menu.hidden
                                ? "bg-green-100 text-green-700"
                                : menu.hidden
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {menu.isActive && !menu.hidden ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </>
                            ) : menu.hidden ? (
                              <>
                                <EyeOff className="w-3 h-3" />
                                Hidden
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3" />
                                Inactive
                              </>
                            )}
                          </span>
                          {menu.createdAt && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                              <Calendar className="w-3 h-3" />
                              {formatDate(menu.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Menu List View */}
        {viewMode === "list" && (
          <>
            {filteredMenus.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <MenuIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No menus found</h3>
                <p className="text-gray-500">No menus match your filter criteria</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Menu
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Path
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredMenus.map((menu) => {
                        const IconComponent = getIconComponent(menu.icon);
                        return (
                          <tr
                            key={menu.id}
                            className={`hover:bg-gray-50 transition-all duration-200 ${menu.hidden ? "opacity-60 bg-orange-50/30" : ""}`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-lg ${
                                    menu.isActive && !menu.hidden
                                      ? "bg-emerald-100 text-emerald-600"
                                      : menu.hidden
                                        ? "bg-orange-100 text-orange-600"
                                        : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{menu.label}</div>
                                  <div className="text-xs text-gray-500 font-mono">{menu.name}</div>
                                  {menu.description && (
                                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                      <Info className="w-3 h-3" />
                                      {menu.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {menu.path && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <Hash className="w-4 h-4 text-gray-400" />
                                  {menu.path}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {menu.type && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                                  {menu.type}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  menu.isActive && !menu.hidden
                                    ? "bg-green-100 text-green-700"
                                    : menu.hidden
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {menu.isActive && !menu.hidden ? (
                                  <>
                                    <Eye className="w-3 h-3" />
                                    Active
                                  </>
                                ) : menu.hidden ? (
                                  <>
                                    <EyeOff className="w-3 h-3" />
                                    Hidden
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-3 h-3" />
                                    Inactive
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(menu.createdAt)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditClick(menu)}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(menu)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer Summary */}
        {filteredMenus.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>
                  Showing {filteredMenus.length} of {menus.length} menus
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {stats.visibleMenus} visible
                </span>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                  {stats.hiddenMenus} hidden
                </span>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {stats.activeMenus} active
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <MenuFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={handleFormSuccess}
        initialData={selectedMenu}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Menu"
        type="permanent"
        itemName={selectedMenu?.label}
        message={`Are you sure you want to delete the menu "${selectedMenu?.label}"? This will also remove it from all roles and cannot be undone.`}
      />
    </div>
  );
}
