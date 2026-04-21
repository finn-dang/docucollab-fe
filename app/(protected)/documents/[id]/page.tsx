"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { documentService, Document } from "@/lib/services/document.service";
import { useAuth } from "@/context/AuthContext";
import CollaborativeEditor from "@/components/editor/CollaborativeEditor";
import { useRef } from "react";
import { Printer, Download } from "lucide-react";
import { exportContentToPDF } from "@/lib/pdf-export";

export default function DocumentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [document, setDocument] = useState<Document | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportContentToPDF(content, title);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };
  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentService.getById(id as string);
      setDocument(data);
      setTitle(data.title);
      setContent(data.content || "");

      // Check if user has edit permission
      const isCollaborator = data.collaborators?.some(
        (c: any) => c.id === user?.id || c === user?.id
      );
      const isOwner = data.ownerId === user?.id;
      setReadOnly(!isOwner && !isCollaborator);
    } catch (err: any) {
      if (err.response?.data?.message === "You do not have access to this document") {
        setError("You do not have permission to view this document");
        setTimeout(() => router.push("/documents"), 3000);
      } else {
        setError("Failed to load document");
      }
    } finally {
      setLoading(false);
    }
  };

  // Save document with HTML content
  const saveDocument = useCallback(
    async (newTitle: string, newContent: string) => {
      if (readOnly) return;
      setSaving(true);
      try {
        await documentService.update(id as string, {
          title: newTitle,
          content: newContent,
        });
        setLastSaved(new Date());
      } catch (error) {
      } finally {
        setSaving(false);
      }
    },
    [id, readOnly]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    saveDocument(newTitle, content);
  };

  // Receive HTML content from editor and save
  const handleContentUpdate = (newContent: string) => {
    setContent(newContent);
    saveDocument(title, newContent);
  };

  const handleDelete = async () => {
    await documentService.delete(id as string);
    router.push("/documents");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">{error}</p>
          <button
            onClick={() => router.push("/documents")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Document not found</p>
        <button
          onClick={() => router.push("/documents")}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Back to Documents
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/documents")}
              className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>

            <div className="flex-1 mx-4">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                disabled={readOnly}
                className="text-xl font-semibold w-full max-w-md px-3 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-gray-50"
                placeholder="Document Title"
              />
            </div>

            <div className="flex items-center gap-2">
              {readOnly && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  View Only
                </span>
              )}
              {saving && (
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  Saving...
                </span>
              )}
              {lastSaved && !saving && (
                <span className="text-sm text-gray-400 hidden sm:inline">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              {!readOnly && (
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="text-gray-400 hover:text-purple-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
              title="Export as PDF"
            >
              {isExporting ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="w-5/6 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CollaborativeEditor
          content={content}
          onUpdate={handleContentUpdate}
          documentId={id as string}
          userId={user?.id || ""}
          userName={user?.userName || "Anonymous"}
          userEmail={user?.email || ""}
          readOnly={readOnly}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Document</h2>
              <p className="text-center text-gray-500 mb-6">
                Are you sure you want to delete "{title}"? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
