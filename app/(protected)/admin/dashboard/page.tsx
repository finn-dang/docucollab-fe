"use client";

import Link from "next/link";
import {
  Users,
  Shield,
  Menu,
  FolderOpen,
  LayoutDashboard,
  ArrowRight,
  TrendingUp,
  FileText,
  UserCheck,
  Settings,
  Activity,
  Clock,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { userService } from "@/lib/services/user.service";
import { roleService } from "@/lib/services/role.service";
import { menuService } from "@/lib/services/menu.service";
import { documentService } from "@/lib/services/document.service";

// Type definition for each module card
interface ModuleCard {
  title: string;
  href: string;
  icon: React.ElementType;
  description: string;
  stats?: string;
  statValue?: number;
  trend?: number;
  color?: string;
}

// Metrics data interface
interface DashboardMetrics {
  totalUsers: number;
  totalRoles: number;
  totalMenus: number;
  totalDocuments: number;
  documentStats?: {
    active: number;
    deleted: number;
    public: number;
    private: number;
  };
}

// Quick stats data with real values
interface QuickStat {
  label: string;
  value: number | string;
  change?: string;
  icon: React.ElementType;
  color: string;
  loading?: boolean;
}

// Recent activity interface
interface RecentActivity {
  action: string;
  time: string;
  user: string;
  type: "user" | "document" | "role" | "menu";
}

export default function AdminDashboardPage() {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    totalRoles: 0,
    totalMenus: 0,
    totalDocuments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    { action: "Welcome to Admin Dashboard", time: "Just now", user: "System", type: "user" },
  ]);

  // Module cards configuration
  const cardsData: ModuleCard[] = [
    {
      title: "User Management",
      href: "/admin/users",
      icon: Users,
      description: "Create, edit, delete users and assign roles",
      stats: "Total Users",
      statValue: metrics.totalUsers,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Role Management",
      href: "/admin/roles",
      icon: Shield,
      description: "Manage user roles and permissions",
      stats: "System Roles",
      statValue: metrics.totalRoles,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Menu Management",
      href: "/admin/menus",
      icon: Menu,
      description: "Configure navigation menu items",
      stats: "Menu Items",
      statValue: metrics.totalMenus,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Document Management",
      href: "/admin/documents",
      icon: FolderOpen,
      description: "Manage all documents across the system",
      stats: "Total Documents",
      statValue: metrics.totalDocuments,
      color: "from-orange-500 to-red-600",
    },
  ];

  // Fetch all metrics data
  const fetchMetrics = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    setError(null);

    try {
      // Fetch all data in parallel for better performance
      const [usersRes, rolesRes, menusRes, documentsRes] = await Promise.allSettled([
        userService.getAll(),
        roleService.getAll(),
        menuService.getAll(),
        documentService.getAllDocuments({ limit: 1 }),
      ]);

      // Process Users
      let totalUsers = 0;
      if (usersRes.status === "fulfilled" && Array.isArray(usersRes.value)) {
        totalUsers = usersRes.value.length;
      } else {
        console.error("Failed to fetch users");
      }

      // Process Roles
      let totalRoles = 0;
      if (rolesRes.status === "fulfilled" && Array.isArray(rolesRes.value)) {
        totalRoles = rolesRes.value.length;
      } else {
        console.error("Failed to fetch roles");
      }

      // Process Menus
      let totalMenus = 0;
      if (menusRes.status === "fulfilled" && Array.isArray(menusRes.value)) {
        totalMenus = menusRes.value.length;
      } else {
        console.error("Failed to fetch menus");
      }

      // Process Documents
      let totalDocuments = 0;
      let documentStats;
      if (documentsRes.status === "fulfilled" && documentsRes.value) {
        totalDocuments = documentsRes.value.total || documentsRes.value.data?.length || 0;

        // Get document statistics if we have data
        if (documentsRes.value.data && documentsRes.value.data.length > 0) {
          const docs = documentsRes.value.data;
          documentStats = {
            active: docs.filter((d: any) => !d.isDeleted).length,
            deleted: docs.filter((d: any) => d.isDeleted).length,
            public: docs.filter((d: any) => d.privacy === "public").length,
            private: docs.filter((d: any) => d.privacy === "private").length,
          };
        }
      } else {
        console.error("Failed to fetch documents");
      }

      setMetrics({
        totalUsers,
        totalRoles,
        totalMenus,
        totalDocuments,
        documentStats,
      });

      // Generate recent activities (mock data - replace with real API if available)
      generateRecentActivities(totalUsers, totalDocuments);
    } catch (err) {
      console.error("Error fetching dashboard metrics:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateRecentActivities = (totalUsers: number, totalDocuments: number) => {
    const activities: RecentActivity[] = [];

    if (totalUsers > 0) {
      activities.push({
        action: `System has ${totalUsers} registered users`,
        time: "Current",
        user: "System",
        type: "user",
      });
    }

    if (totalDocuments > 0) {
      activities.push({
        action: `${totalDocuments} documents in the system`,
        time: "Current",
        user: "System",
        type: "document",
      });
    }

    activities.push({
      action: "Admin dashboard is ready",
      time: "Just now",
      user: "System",
      type: "role",
    });

    setRecentActivities(activities);
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    setCurrentTime(
      new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );

    fetchMetrics();
  }, []);

  // Quick stats with real data
  const quickStats: QuickStat[] = [
    {
      label: "Total Users",
      value: metrics.totalUsers,
      change: "+0%",
      icon: Users,
      color: "blue",
      loading: loading,
    },
    {
      label: "Total Documents",
      value: metrics.totalDocuments,
      change: "+0%",
      icon: FileText,
      color: "green",
      loading: loading,
    },
    {
      label: "System Roles",
      value: metrics.totalRoles,
      change: "+0%",
      icon: Shield,
      color: "purple",
      loading: loading,
    },
    {
      label: "Menu Items",
      value: metrics.totalMenus,
      change: "+0%",
      icon: Activity,
      color: "orange",
      loading: loading,
    },
  ];

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="w-full px-3 sm:px-5 py-6 md:py-8">
          <div className="mx-auto">
            {/* Loading Skeleton */}
            <div className="mb-6 md:mb-8">
              <div className="bg-gradient-to-r from-[#8B5CF6] via-[#6D28D9] to-[#3B82F6] rounded-2xl shadow-xl p-6 md:p-8">
                <div className="animate-pulse">
                  <div className="h-8 bg-white/20 rounded-lg w-64 mb-2"></div>
                  <div className="h-4 bg-white/20 rounded-lg w-96"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-4 md:p-5 animate-pulse">
                  <div className="flex justify-between mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                    <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Full width layout with minimal padding */}
      <div className="w-full px-3 sm:px-5 py-6 md:py-8">
        <div className="mx-auto">
          {/* Welcome Header - Enhanced */}
          <div className="mb-6 md:mb-8">
            <div className="bg-gradient-to-r from-[#8B5CF6] via-[#6D28D9] to-[#3B82F6] rounded-2xl shadow-xl p-6 md:p-8 text-white relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl">👋</span>
                      <h1 className="text-2xl md:text-3xl font-bold">{greeting}, Admin!</h1>
                    </div>
                    <p className="text-purple-100 text-base md:text-lg">
                      Welcome back to your dashboard. Here's what's happening with your system
                      today.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fetchMetrics(true)}
                      disabled={refreshing}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 hover:bg-white/20 transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                      <span className="text-sm">Refresh</span>
                    </button>
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                      <Clock className="w-5 h-5 text-purple-200" />
                      <span className="text-white font-medium">{currentTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <button
                onClick={() => fetchMetrics()}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {/* Quick Stats Row - Real Data */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
            {quickStats.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 p-4 md:p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} p-2 md:p-3 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    {stat.change && (
                      <span
                        className={`text-xs font-semibold ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"} bg-green-50 px-2 py-1 rounded-full`}
                      >
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm font-medium">{stat.label}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Document Statistics (if available) */}
          {metrics.documentStats && (
            <div className="mb-6 bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                Document Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-2">
                  <p className="text-2xl font-bold text-green-600">
                    {metrics.documentStats.active}
                  </p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-2xl font-bold text-red-600">{metrics.documentStats.deleted}</p>
                  <p className="text-xs text-gray-500">Deleted</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-2xl font-bold text-blue-600">{metrics.documentStats.public}</p>
                  <p className="text-xs text-gray-500">Public</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-2xl font-bold text-yellow-600">
                    {metrics.documentStats.private}
                  </p>
                  <p className="text-xs text-gray-500">Private</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Module Cards - Takes 2/3 of the space */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">System Modules</h2>
                <span className="text-xs text-gray-400">Quick access to management tools</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {cardsData.map((card, idx) => {
                  const IconComponent = card.icon;
                  return (
                    <div
                      key={card.title}
                      className="group bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-purple-300 flex flex-col h-full"
                    >
                      <div className="p-5 md:p-6 flex flex-col flex-grow">
                        {/* Icon and Title */}
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className={`bg-gradient-to-br ${card.color} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}
                          >
                            <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                              {card.title}
                            </h3>
                            {card.stats && card.statValue !== undefined && (
                              <p className="text-2xl font-bold text-gray-900 mt-1">
                                {card.statValue.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-grow">
                          {card.description}
                        </p>

                        {/* Action Button */}
                        <Link
                          href={card.href}
                          className="inline-flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 hover:bg-purple-50 rounded-lg text-purple-600 font-semibold transition-all duration-200 group/link"
                        >
                          <span>Manage Module</span>
                          <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity - Takes 1/3 of the space */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">System Overview</h2>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
                <div className="space-y-4">
                  {recentActivities.map((activity, idx) => {
                    const getActivityIcon = () => {
                      switch (activity.type) {
                        case "user":
                          return <UserCheck className="w-4 h-4 text-blue-500" />;
                        case "document":
                          return <FileText className="w-4 h-4 text-green-500" />;
                        case "role":
                          return <Shield className="w-4 h-4 text-purple-500" />;
                        case "menu":
                          return <Menu className="w-4 h-4 text-orange-500" />;
                        default:
                          return <Activity className="w-4 h-4 text-gray-500" />;
                      }
                    };

                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0 group hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                      >
                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                          {getActivityIcon()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">{activity.user}</span>
                            <span className="text-xs text-gray-300">•</span>
                            <span className="text-xs text-gray-400">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100">
                <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link
                    href="/admin/documents"
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors"
                  >
                    📄 + Manage documents
                  </Link>
                  <Link
                    href="/admin/users"
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors"
                  >
                    👥 + Manage users
                  </Link>
                  <Link
                    href="/admin/roles"
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors"
                  >
                    ⚙️ Manage roles
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <span>Admin Dashboard v1.0</span>
                <span>Real-time metrics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
