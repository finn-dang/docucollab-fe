"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LogOut,
  User,
  FileText,
  Users,
  Settings,
  LayoutDashboard,
  Shield,
  Menu as MenuIcon,
  FolderOpen,
} from "lucide-react";
import NotificationBell from "@/components/notification/NotificationBell";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Check if user is admin (role is an array)
  const isAdmin =
    user?.role && Array.isArray(user.role) && user.role.some((role) => role.name === "admin");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Admin Layout with Sidebar
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 ${isSidebarOpen ? "w-64" : "w-20"}`}
        >
          <div className="flex flex-col h-full">
            {/* Logo Area */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
              {isSidebarOpen ? (
                <>
                  <Link href="/admin/dashboard" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"></div>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      DocuCollab
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/admin/dashboard" className="mx-auto">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"></div>
                  </Link>
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Menu className="w-5 h-5 text-gray-500" />
                  </button>
                </>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-6 px-3 space-y-2">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
              >
                <LayoutDashboard className="w-5 h-5" />
                {isSidebarOpen && <span>Admin Dashboard</span>}
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
              >
                <Users className="w-5 h-5" />
                {isSidebarOpen && <span>Users</span>}
              </Link>

              <Link
                href="/admin/roles"
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
              >
                <Shield className="w-5 h-5" />
                {isSidebarOpen && <span>Roles</span>}
              </Link>

              <Link
                href="/admin/menus"
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
              >
                <MenuIcon className="w-5 h-5" />
                {isSidebarOpen && <span>Menus</span>}
              </Link>

              {/* ✅ Add Admin Documents Link */}
              <Link
                href="/admin/documents"
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
              >
                <FolderOpen className="w-5 h-5" />
                {isSidebarOpen && <span>All Documents</span>}
              </Link>
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-gray-200">
              <div
                className={`flex items-center ${isSidebarOpen ? "justify-between" : "justify-center"} mb-3`}
              >
                <div
                  className={`flex items-center gap-3 ${!isSidebarOpen && "justify-center w-full"}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {user.userName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  {isSidebarOpen && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.userName}</p>
                      <p className="text-xs text-gray-500 truncate">Admin</p>
                    </div>
                  )}
                </div>
                {isSidebarOpen && (
                  <button
                    onClick={handleLogout}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                )}
              </div>
              {!isSidebarOpen && (
                <button
                  onClick={handleLogout}
                  className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
                >
                  <LogOut className="w-5 h-5 mx-auto" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
          <div className="p-8">{children}</div>
        </main>
      </div>
    );
  }

  // Non-Admin Layout with Header and Footer
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/documents" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"></div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                DocuCollab
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/documents"
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Documents
              </Link>
              <Link
                href="/team"
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Team
              </Link>
              <Link
                href="/settings"
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <NotificationBell />
              <div className="flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                  {user.userName?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.userName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-3 space-y-3">
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                  {user.userName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.userName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="ml-auto">
                  <NotificationBell />
                </div>
              </div>
              <Link
                href="/documents"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="w-5 h-5" />
                Documents
              </Link>
              <Link
                href="/team"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="w-5 h-5" />
                Team
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                Settings
              </Link>
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-12 w-full">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                DocuCollab
              </h3>
              <p className="text-sm">Collaborative document editing made simple.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/documents" className="hover:text-white transition-colors text-sm">
                    Documents
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="hover:text-white transition-colors text-sm">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors text-sm">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors text-sm">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors text-sm">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors text-sm">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors text-sm">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white transition-colors text-sm">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">© 2024 DocuCollab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
