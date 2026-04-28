"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Users,
  Bold,
  History,
  Shield,
  Play,
  ArrowRight,
  Eye,
  Type,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    const demoSection = document.getElementById("demo");
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Check if user is admin
  const isAdmin =
    user?.role && Array.isArray(user.role) && user.role.some((role) => role.name === "admin");

  const features = [
    {
      icon: Users,
      title: "Real-time Collaboration",
      description:
        "See cursors move, changes appear instantly, and collaborate with your team in real-time.",
    },
    {
      icon: Bold,
      title: "Rich Text Editing",
      description:
        "Format text, add images, create tables, and embed media with our powerful editor.",
    },
    {
      icon: History,
      title: "Version History",
      description: "Track every change, restore previous versions, and never lose your work again.",
    },
    {
      icon: Shield,
      title: "Privacy Controls",
      description:
        "Set document permissions, control access, and keep your data secure with enterprise-grade encryption.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      quote:
        "DocuCollab has transformed how our team writes documentation. The real-time collaboration is seamless!",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      quote:
        "Best collaborative editor I've used. The live cursors and typing indicators make remote work feel local.",
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Content Strategist",
      quote:
        "Version history and commenting features are game-changers. Our editorial workflow has never been smoother.",
      avatar: "ER",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Account",
      description: "Sign up for free and invite your team members to get started.",
      link: "/register",
    },
    {
      number: "02",
      title: "Create Document",
      description: "Start a new document or import existing files with one click.",
      link: "/documents",
    },
    {
      number: "03",
      title: "Share & Collaborate",
      description: "Invite teammates, set permissions, and start collaborating in real-time.",
      link: "/documents",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              >
                DocuCollab
              </Link>
            </div>

            {/* Desktop Navigation - Different for logged in users */}
            <div className="hidden md:flex items-center space-x-8">
              {!user ? (
                // Public navigation
                <>
                  <Link
                    href="#features"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="#pricing"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="#about"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    About
                  </Link>
                </>
              ) : (
                // Authenticated user navigation
                <>
                  <Link
                    href="/documents"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Documents
                  </Link>
                  <Link
                    href="/team"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Team
                  </Link>
                  <Link
                    href="/settings"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Settings
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Desktop Buttons/User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {!user ? (
                // Public buttons
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                // User menu for authenticated users
                <>
                  <div className="flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user.userName?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.userName || user.email?.split("@")[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              )}
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
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="px-4 py-2 space-y-2">
              {!user ? (
                // Public mobile navigation
                <>
                  <Link href="#features" className="block py-2 text-gray-600 hover:text-gray-900">
                    Features
                  </Link>
                  <Link href="#pricing" className="block py-2 text-gray-600 hover:text-gray-900">
                    Pricing
                  </Link>
                  <Link href="#about" className="block py-2 text-gray-600 hover:text-gray-900">
                    About
                  </Link>
                  <div className="pt-4 pb-2 space-y-2">
                    <Link href="/login" className="block w-full text-center py-2 text-gray-700">
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg"
                    >
                      Get Started
                    </Link>
                  </div>
                </>
              ) : (
                // Authenticated user mobile navigation
                <>
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                      {user.userName?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.userName || user.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/documents"
                    className="block py-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Documents
                  </Link>
                  <Link
                    href="/team"
                    className="block py-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Team
                  </Link>
                  <Link
                    href="/settings"
                    className="block py-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="block py-2 text-purple-600 hover:text-purple-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
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
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* For authenticated users, redirect to dashboard or show different content */}
      {user ? (
        // Authenticated user landing page
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {user.userName || user.email?.split("@")[0]}!
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Ready to continue collaborating? Access your documents or start a new project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/documents"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center justify-center gap-2"
              >
                Go to Documents <ArrowRight className="w-5 h-5" />
              </Link>
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 inline-flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Admin Panel
                </Link>
              )}
            </div>

            {/* Quick Stats or Recent Documents could go here */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Collaboration</h3>
                <p className="text-gray-600">Work together in real-time with your team members.</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <History className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Version History</h3>
                <p className="text-gray-600">
                  Track changes and restore previous versions anytime.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-gray-600">Enterprise-grade security for your documents.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Public landing page content
        <>
          {/* Hero Section */}
          <section className="pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Write Together.{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Share Instantly.
                  </span>
                  <br />
                  Collaborate in Real-Time.
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                  The collaborative document editor where teams create, edit, and share documents
                  with live cursors, real-time sync, and version history.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center justify-center gap-2"
                  >
                    Start Writing <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={scrollToDemo}
                    className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-purple-600 hover:text-purple-600 transition-all duration-200 inline-flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" /> Watch Demo
                  </button>
                </div>
              </div>

              {/* Hero Illustration */}
              <div className="mt-16 relative">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 shadow-xl">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="flex-1"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                          JD
                        </div>
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                          MK
                        </div>
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                          AL
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-500">John is editing this document</span>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-purple-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Powerful Features for{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Seamless Collaboration
                  </span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Everything you need to create, edit, and share documents with your team
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Live Demo Preview Section */}
          <section id="demo" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  See It in{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Action
                  </span>
                </h2>
                <p className="text-xl text-gray-600">
                  Experience real-time collaboration firsthand
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
                {/* Mock Toolbar */}
                <div className="bg-gray-50 px-4 py-3 border-b flex flex-wrap gap-2">
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <Type className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <Bold className="w-5 h-5" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                {/* Mock Document */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-white text-xs">
                          JD
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs">
                          MK
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white text-xs">
                          AL
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">3 active users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${isTyping ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
                      ></div>
                      <span className="text-sm text-gray-500">
                        {isTyping ? "Someone is typing..." : "All caught up"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 relative">
                    <div className="absolute left-0 top-8 w-0.5 h-6 bg-purple-500"></div>
                    <div className="relative">
                      <span className="absolute -left-4 top-0 text-purple-500">▶</span>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Welcome to DocuCollab!
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      This is a live preview of our collaborative document editor. Watch as multiple
                      users can edit the same document in real-time, with each person's cursor
                      visible to everyone else.
                    </p>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <p className="text-yellow-800 text-sm">
                        💡 Tip: Invite your team members to see the magic of real-time
                        collaboration!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-8 py-4 border-t">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all"
                  >
                    Try It Now <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  How{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    DocuCollab
                  </span>{" "}
                  Works
                </h2>
                <p className="text-xl text-gray-600">Get started in three simple steps</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                  <div key={index} className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <Link
                      href={step.link}
                      className="inline-flex items-center gap-2 text-purple-600 hover:gap-3 transition-all"
                    >
                      Learn more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Loved by{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Teams Worldwide
                  </span>
                </h2>
                <p className="text-xl text-gray-600">Join thousands of satisfied users</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 shadow-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to collaborate?
                </h2>
                <p className="text-xl text-purple-100 mb-8">
                  Start creating documents with your team today
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
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
                  <Link href="#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="hover:text-white transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
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
