"use client";

import { useEffect, useState } from "react";
import { documentService, Document } from "@/lib/services/document.service";
import { documentTypeService } from "@/lib/services/documentType.service";
import { useAuth } from "@/context/AuthContext";
import CreateDocumentModal from "@/components/document/CreateDocumentModal";
import WelcomeSection from "@/components/document/WelcomeSection";
import DocumentTabs, { DocumentTab } from "@/components/document/DocumentTabs";
import DocumentSearchBar from "@/components/document/DocumentSearchBar";
import DocumentFilters from "@/components/document/DocumentFilters";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import DocumentEmptyState from "@/components/document/DocumentEmptyState";

import DocumentListView from "@/components/document/DocumentListView";
import DocumentGrid from "@/components/document/DocumentGrid";

export default function DocumentsPage() {
  const [ownedDocuments, setOwnedDocuments] = useState<Document[]>([]);
  const [collaboratedDocuments, setCollaboratedDocuments] = useState<Document[]>([]);
  const [viewedDocuments, setViewedDocuments] = useState<Document[]>([]);
  const [documentTypes, setDocumentTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; document: Document | null }>({
    isOpen: false,
    document: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPrivacy, setSelectedPrivacy] = useState<"all" | "public" | "private">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<DocumentTab>("owned");

  const { user } = useAuth();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [owned, collaborated, viewed, typesData] = await Promise.all([
        documentService.getByOwnerId(user.id),
        documentService.getByCollaborator(user.id),
        documentService.getByViewer(user.id),
        documentTypeService.getAll(),
      ]);
      setOwnedDocuments(owned);
      setCollaboratedDocuments(collaborated);
      setViewedDocuments(viewed);
      setDocumentTypes(typesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentTypeName = (typeId?: string) => {
    if (!typeId) return null;
    const type = documentTypes.find((t) => t.id === typeId);
    return type?.name || null;
  };

  const getDocumentTypeColor = (typeId?: string) => {
    if (!typeId) return "bg-gray-100 text-gray-600";
    const colors: Record<string, string> = {
      "Technical Document": "bg-blue-100 text-blue-700",
      "Meeting Notes": "bg-purple-100 text-purple-700",
      "Personal Note": "bg-green-100 text-green-700",
      "Task List": "bg-orange-100 text-orange-700",
      "Quick Note": "bg-gray-100 text-gray-600",
    };
    const typeName = getDocumentTypeName(typeId);
    return colors[typeName || ""] || "bg-gray-100 text-gray-600";
  };

  const getUserRoleForDocument = (doc: Document): { role: string; color: string } => {
    if (doc.ownerId === user?.id) {
      return { role: "Owner", color: "bg-purple-100 text-purple-700" };
    }
    if (
      doc.collaborators?.some((c) => (typeof c === "object" ? c.id === user?.id : c === user?.id))
    ) {
      return { role: "Editor", color: "bg-blue-100 text-blue-700" };
    }
    if (doc.viewers?.some((v) => (typeof v === "object" ? v.id === user?.id : v === user?.id))) {
      return { role: "Viewer", color: "bg-gray-100 text-gray-600" };
    }
    return { role: "Owner", color: "bg-purple-100 text-purple-700" };
  };

  const getCurrentDocuments = () => {
    switch (activeTab) {
      case "owned":
        return ownedDocuments;
      case "collaborated":
        return collaboratedDocuments;
      case "viewed":
        return viewedDocuments;
      default:
        return ownedDocuments;
    }
  };

  const currentDocuments = getCurrentDocuments();

  const filteredDocuments = currentDocuments.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? getDocumentTypeName(doc.documentTypeId) === selectedTag : true;
    const matchesPrivacy = selectedPrivacy === "all" ? true : doc.privacy === selectedPrivacy;
    return matchesSearch && matchesTag && matchesPrivacy;
  });

  const allTags = [
    ...new Set(
      currentDocuments.map((doc) => getDocumentTypeName(doc.documentTypeId)).filter(Boolean)
    ),
  ] as string[];

  const hasFilters = searchQuery !== "" || selectedTag !== null || selectedPrivacy !== "all";

  const getCollaboratorCount = (doc: Document) => doc.collaborators?.length || 0;
  const getViewerCount = (doc: Document) => doc.viewers?.length || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <WelcomeSection
          ownedCount={ownedDocuments.length}
          collaboratedCount={collaboratedDocuments.length}
          viewedCount={viewedDocuments.length}
        />

        {/* Document Tabs */}
        <DocumentTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{
            owned: ownedDocuments.length,
            collaborated: collaboratedDocuments.length,
            viewed: viewedDocuments.length,
          }}
        />

        {/* Search Bar */}
        <DocumentSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Filters */}
        <DocumentFilters
          selectedPrivacy={selectedPrivacy}
          onPrivacyChange={setSelectedPrivacy}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          availableTags={allTags}
          onCreateNew={() => setShowCreateModal(true)}
        />

        {/* Document List */}
        {filteredDocuments.length === 0 ? (
          <DocumentEmptyState
            hasFilters={hasFilters}
            isOwnedTab={activeTab === "owned"}
            onCreateNew={() => setShowCreateModal(true)}
          />
        ) : viewMode === "grid" ? (
          <DocumentGrid
            documents={filteredDocuments}
            getDocumentTypeName={getDocumentTypeName}
            getDocumentTypeColor={getDocumentTypeColor}
            getUserRoleForDocument={getUserRoleForDocument}
            getCollaboratorCount={getCollaboratorCount}
            getViewerCount={getViewerCount}
            onDelete={(doc) => setDeleteModal({ isOpen: true, document: doc })}
          />
        ) : (
          <DocumentListView
            documents={filteredDocuments}
            getDocumentTypeName={getDocumentTypeName}
            getDocumentTypeColor={getDocumentTypeColor}
            getUserRoleForDocument={getUserRoleForDocument}
            getCollaboratorCount={getCollaboratorCount}
            getViewerCount={getViewerCount}
            onDelete={(doc) => setDeleteModal({ isOpen: true, document: doc })}
          />
        )}
      </main>

      {/* Create Document Modal */}
      <CreateDocumentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={async (data) => {
          setSubmitting(true);
          try {
            const created = await documentService.create(data);
            setShowCreateModal(false);
            await loadAllData();
          } catch (error) {
            alert("Failed to create document");
          } finally {
            setSubmitting(false);
          }
        }}
        submitting={submitting}
        ownerId={user?.id || ""}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Document"
        message={`Are you sure you want to delete "${deleteModal.document?.title}"? This action cannot be undone.`}
        onClose={() => setDeleteModal({ isOpen: false, document: null })}
        onConfirm={async () => {
          if (deleteModal.document) {
            await documentService.delete(deleteModal.document.id);
            setDeleteModal({ isOpen: false, document: null });
            await loadAllData();
          }
        }}
        isDeleting={submitting}
      />
    </div>
  );
}
