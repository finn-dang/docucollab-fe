"use client";

import { useEffect, useState } from "react";
import { documentService, Document } from "@/lib/services/document.service";
import { format } from "date-fns";
import {
  Search,
  Trash2,
  RotateCcw,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  Lock,
  Globe,
  Users,
  Archive,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState<"all" | "public" | "private">("all");
  const [showDeleted, setShowDeleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    document: Document | null;
    isPermanent?: boolean;
  }>({ isOpen: false, document: null });
  const [submitting, setSubmitting] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const limit = 10;

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const result = await documentService.getAllDocuments({
        page: currentPage,
        limit,
        search: searchQuery || undefined,
        privacy: privacyFilter === "all" ? undefined : privacyFilter,
        isDeleted: showDeleted,
      });
      setDocuments(result.data);
      setTotalPages(Math.ceil(result.total / limit));
      setTotalItems(result.total);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [currentPage, privacyFilter, showDeleted]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery !== undefined) {
        setCurrentPage(1);
        fetchDocuments();
      }
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleDelete = async (doc: Document, permanent: boolean = false) => {
    setSubmitting(true);
    try {
      if (permanent) {
        await documentService.permanentlyDelete(doc.id);
      } else {
        await documentService.delete(doc.id);
      }
      setDeleteModal({ isOpen: false, document: null, isPermanent: false });
      fetchDocuments();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestore = async (doc: Document) => {
    setSubmitting(true);
    try {
      await documentService.restoreDocument(doc.id);
      fetchDocuments();
    } catch (error) {
      console.error("Restore failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (doc: Document, permanent: boolean = false) => {
    setDeleteModal({ isOpen: true, document: doc, isPermanent: permanent });
  };

  const getOwnerName = (doc: Document) => {
    if (typeof doc.ownerId === "object") {
      return (doc.ownerId as any).displayName || (doc.ownerId as any).username;
    }
    return doc.ownerId;
  };

  const activeCount = documents.filter((d) => !d.isDeleted).length;
  const deletedCount = documents.filter((d) => d.isDeleted).length;

  if (loading && documents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="w-full px-3 sm:px-5 py-6 md:py-8">
        <div className="mx-auto">
          {/* Header with gradient */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Document Management</h1>
                  <p className="text-indigo-100 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Manage all documents across the system
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-3xl font-bold">{totalItems}</div>
                    <div className="text-sm text-indigo-200">Total Documents</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards with animations */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Total Documents</p>
                  <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 text-white shadow-lg">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-gray-400">
                <span>Across all users</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Active Documents</p>
                  <p className="text-3xl font-bold text-green-600">{activeCount}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 text-white shadow-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-gray-400">
                <span>Available to users</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Deleted</p>
                  <p className="text-3xl font-bold text-orange-600">{deletedCount}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-3 text-white shadow-lg">
                  <Archive className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-gray-400">
                <span>In trash bin</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Recovery Rate</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {totalItems ? Math.round((activeCount / totalItems) * 100) : 0}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3 text-white shadow-lg">
                  <RefreshCw className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-gray-400">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${totalItems ? (activeCount / totalItems) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by title, content, or owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 rounded-xl hover:border-indigo-500 transition-all bg-white"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="font-medium">Filters</span>
                    {(privacyFilter !== "all" || showDeleted) && (
                      <span className="bg-indigo-500 text-white text-xs rounded-full px-2 py-0.5">
                        {
                          [privacyFilter !== "all" && privacyFilter, showDeleted && "trash"].filter(
                            Boolean
                          ).length
                        }
                      </span>
                    )}
                  </button>

                  {filterOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
                      <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-20 min-w-[200px]">
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                              Privacy
                            </label>
                            <div className="space-y-1">
                              {[
                                { value: "all", label: "All", icon: Users },
                                { value: "public", label: "Public", icon: Globe },
                                { value: "private", label: "Private", icon: Lock },
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => {
                                    setPrivacyFilter(option.value as any);
                                    setCurrentPage(1);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                    privacyFilter === option.value
                                      ? "bg-indigo-50 text-indigo-700 font-medium"
                                      : "hover:bg-gray-50 text-gray-700"
                                  }`}
                                >
                                  <option.icon className="w-4 h-4" />
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="pt-2 border-t">
                            <button
                              onClick={() => {
                                setShowDeleted(!showDeleted);
                                setCurrentPage(1);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                showDeleted
                                  ? "bg-orange-50 text-orange-700 font-medium"
                                  : "hover:bg-gray-50 text-gray-700"
                              }`}
                            >
                              <Archive className="w-4 h-4" />
                              Show Deleted
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setPrivacyFilter("all");
                    setShowDeleted(false);
                    setCurrentPage(1);
                  }}
                  className="px-5 py-3 text-gray-600 hover:text-gray-900 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Documents Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    {["Title", "Owner", "Privacy", "Status", "Last Updated", "Actions"].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {documents.map((doc, index) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-gray-50 transition-all duration-200 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${doc.isDeleted ? "bg-gray-100" : "bg-indigo-50"} group-hover:scale-110 transition-transform`}
                          >
                            <FileText
                              className={`w-5 h-5 ${doc.isDeleted ? "text-gray-400" : "text-indigo-600"}`}
                            />
                          </div>
                          <Link
                            href={`/documents/${doc.id}`}
                            className="font-medium text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1"
                          >
                            {doc.title}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {getOwnerName(doc).charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-700">{getOwnerName(doc)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                            doc.privacy === "public"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {doc.privacy === "public" ? (
                            <Globe className="w-3 h-3" />
                          ) : (
                            <Lock className="w-3 h-3" />
                          )}
                          {doc.privacy}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                            doc.isDeleted
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {doc.isDeleted ? (
                            <Archive className="w-3 h-3" />
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {doc.isDeleted ? "Deleted" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(doc.updatedAt), "MMM d, yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/documents/${doc.id}`}
                            className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {doc.isDeleted ? (
                            <>
                              <button
                                onClick={() => handleRestore(doc)}
                                className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all"
                                title="Restore"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(doc, true)}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                title="Permanent Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => openDeleteModal(doc, false)}
                              className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all"
                              title="Soft Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {documents.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * limit, totalItems)}</span>{" "}
                  of <span className="font-medium">{totalItems}</span> results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg transition-all ${
                            currentPage === pageNum
                              ? "bg-indigo-600 text-white shadow-md"
                              : "border border-gray-300 text-gray-700 hover:bg-white"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal with better styling */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.isPermanent ? "Permanently Delete Document" : "Move to Trash"}
        message={
          <div className="space-y-2">
            <p>
              {deleteModal.isPermanent
                ? `Are you sure you want to permanently delete "${deleteModal.document?.title}"?`
                : `Are you sure you want to move "${deleteModal.document?.title}" to trash?`}
            </p>
            {deleteModal.isPermanent ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  This action CANNOT be undone. The document will be permanently removed from the
                  system.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  You can restore it later from the trash bin.
                </p>
              </div>
            )}
          </div>
        }
        onClose={() => setDeleteModal({ isOpen: false, document: null, isPermanent: false })}
        onConfirm={() =>
          deleteModal.document && handleDelete(deleteModal.document, deleteModal.isPermanent)
        }
        isDeleting={submitting}
      />
    </div>
  );
}
