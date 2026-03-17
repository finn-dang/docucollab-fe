"use client";

import { useEffect, useState } from "react";
import { User, userService } from "@/lib/services/user.service";
import { DocumentType, documentTypeService } from "@/lib/services/documentType.service";

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => Promise<void>;
  submitting: boolean;
  ownerId: string;
}

export default function CreateDocumentModal({
  isOpen,
  onClose,
  onCreate,
  submitting,
  ownerId,
}: CreateDocumentModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    privacy: "private" as "public" | "private",
    documentTypeId: "",
    collaborators: [] as string[],
    viewers: [] as string[],
  });

  const [searchCollaborator, setSearchCollaborator] = useState("");
  const [searchViewer, setSearchViewer] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    const [usersData, typesData] = await Promise.all([
      userService.getAll(),
      documentTypeService.getAll(),
    ]);
    setUsers(usersData);
    setDocumentTypes(typesData);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    await onCreate({
      title: formData.title,
      content: formData.content,
      ownerId: ownerId,
      collaborators: formData.collaborators,
      viewers: formData.viewers,
      privacy: formData.privacy,
      documentTypeId: formData.documentTypeId || undefined,
    });

    // Reset form
    setFormData({
      title: "",
      content: "",
      privacy: "private",
      documentTypeId: "",
      collaborators: [],
      viewers: [],
    });
    setSearchCollaborator("");
    setSearchViewer("");
  };

  const addCollaborator = (userId: string) => {
    if (!formData.collaborators.includes(userId)) {
      setFormData({
        ...formData,
        collaborators: [...formData.collaborators, userId],
      });
    }
    setSearchCollaborator("");
  };

  const removeCollaborator = (userId: string) => {
    setFormData({
      ...formData,
      collaborators: formData.collaborators.filter((id) => id !== userId),
    });
  };

  const addViewer = (userId: string) => {
    if (!formData.viewers.includes(userId)) {
      setFormData({
        ...formData,
        viewers: [...formData.viewers, userId],
      });
    }
    setSearchViewer("");
  };

  const removeViewer = (userId: string) => {
    setFormData({
      ...formData,
      viewers: formData.viewers.filter((id) => id !== userId),
    });
  };

  const getSelectedUsers = (userIds: string[]) => {
    return userIds.map((id) => users.find((u) => u.id === id)).filter(Boolean) as User[];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div
          className="sticky top-0 z-10 flex justify-between items-center p-6 border-b"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
        >
          <h2 className="text-xl font-bold" style={{ color: "#111827" }}>
            Create New Document
          </h2>
          <button onClick={onClose} className="hover:opacity-70" style={{ color: "#6B7280" }}>
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

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#111827" }}>
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E5E7EB",
                  color: "#111827",
                }}
                placeholder="Enter document title"
                autoFocus
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#111827" }}>
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E5E7EB",
                  color: "#111827",
                }}
                placeholder="Write your document content..."
              />
            </div>

            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#111827" }}>
                Document Type
              </label>
              <select
                value={formData.documentTypeId}
                onChange={(e) => setFormData({ ...formData, documentTypeId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E5E7EB",
                  color: "#111827",
                }}
              >
                <option value="">Select a type</option>
                {documentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} {type.description && `- ${type.description}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Privacy Toggle */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#111827" }}>
                Privacy
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="private"
                    checked={formData.privacy === "private"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        privacy: e.target.value as "private",
                      })
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span style={{ color: "#111827" }}>Private</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="public"
                    checked={formData.privacy === "public"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        privacy: e.target.value as "public",
                      })
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span style={{ color: "#111827" }}>Public</span>
                </label>
              </div>
              <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                {formData.privacy === "private"
                  ? "Only selected collaborators/viewers can access this document"
                  : "Anyone with the link can view this document"}
              </p>
            </div>

            {/* Collaborators (Can Edit) - Display selected users */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#111827" }}>
                Collaborators (Can Edit)
              </label>

              {/* Display selected collaborators as badges */}
              {getSelectedUsers(formData.collaborators).length > 0 && (
                <div
                  className="flex flex-wrap gap-2 mb-3 p-3 border rounded-lg"
                  style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}
                >
                  {getSelectedUsers(formData.collaborators).map((user) => (
                    <span
                      key={user.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                      style={{ backgroundColor: "#DBEAFE", color: "#2563EB" }}
                    >
                      <span className="font-medium">{user.displayName}</span>
                      <span className="text-xs opacity-75">{user.email}</span>
                      <button
                        onClick={() => removeCollaborator(user.id)}
                        className="hover:opacity-70 ml-1"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search input for adding collaborators */}
              <div className="relative">
                <input
                  type="text"
                  value={searchCollaborator}
                  onChange={(e) => setSearchCollaborator(e.target.value)}
                  placeholder="Search users to add as collaborators..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E5E7EB",
                    color: "#111827",
                  }}
                />
                {searchCollaborator && (
                  <div
                    className="absolute z-20 w-full mt-1 border rounded-lg shadow-lg max-h-48 overflow-y-auto"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E5E7EB",
                    }}
                  >
                    {users
                      .filter(
                        (user) =>
                          user.id !== ownerId &&
                          !formData.collaborators.includes(user.id) &&
                          (user.displayName
                            .toLowerCase()
                            .includes(searchCollaborator.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchCollaborator.toLowerCase()))
                      )
                      .map((user) => (
                        <button
                          key={user.id}
                          onClick={() => addCollaborator(user.id)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
                          style={{ color: "#111827" }}
                        >
                          <div className="font-medium">{user.displayName}</div>
                          <div className="text-xs" style={{ color: "#6B7280" }}>
                            {user.email}
                          </div>
                        </button>
                      ))}
                    {users.filter(
                      (user) =>
                        user.id !== ownerId &&
                        !formData.collaborators.includes(user.id) &&
                        (user.displayName
                          .toLowerCase()
                          .includes(searchCollaborator.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchCollaborator.toLowerCase()))
                    ).length === 0 && (
                      <div className="px-3 py-2 text-sm" style={{ color: "#6B7280" }}>
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Viewers (Can View Only) - Display selected users */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#111827" }}>
                Viewers (Can View Only)
              </label>

              {/* Display selected viewers as badges */}
              {getSelectedUsers(formData.viewers).length > 0 && (
                <div
                  className="flex flex-wrap gap-2 mb-3 p-3 border rounded-lg"
                  style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}
                >
                  {getSelectedUsers(formData.viewers).map((user) => (
                    <span
                      key={user.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                      style={{ backgroundColor: "#F3E8FF", color: "#9333EA" }}
                    >
                      <span className="font-medium">{user.displayName}</span>
                      <span className="text-xs opacity-75">{user.email}</span>
                      <button
                        onClick={() => removeViewer(user.id)}
                        className="hover:opacity-70 ml-1"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search input for adding viewers */}
              <div className="relative">
                <input
                  type="text"
                  value={searchViewer}
                  onChange={(e) => setSearchViewer(e.target.value)}
                  placeholder="Search users to add as viewers..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E5E7EB",
                    color: "#111827",
                  }}
                />
                {searchViewer && (
                  <div
                    className="absolute z-20 w-full mt-1 border rounded-lg shadow-lg max-h-48 overflow-y-auto"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E5E7EB",
                    }}
                  >
                    {users
                      .filter(
                        (user) =>
                          user.id !== ownerId &&
                          !formData.viewers.includes(user.id) &&
                          !formData.collaborators.includes(user.id) &&
                          (user.displayName.toLowerCase().includes(searchViewer.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchViewer.toLowerCase()))
                      )
                      .map((user) => (
                        <button
                          key={user.id}
                          onClick={() => addViewer(user.id)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
                          style={{ color: "#111827" }}
                        >
                          <div className="font-medium">{user.displayName}</div>
                          <div className="text-xs" style={{ color: "#6B7280" }}>
                            {user.email}
                          </div>
                        </button>
                      ))}
                    {users.filter(
                      (user) =>
                        user.id !== ownerId &&
                        !formData.viewers.includes(user.id) &&
                        !formData.collaborators.includes(user.id) &&
                        (user.displayName.toLowerCase().includes(searchViewer.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchViewer.toLowerCase()))
                    ).length === 0 && (
                      <div className="px-3 py-2 text-sm" style={{ color: "#6B7280" }}>
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div
          className="sticky bottom-0 flex justify-end gap-3 p-6 border-t"
          style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: "#F9FAFB", color: "#6B7280" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !formData.title.trim()}
            className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              "Create Document"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
