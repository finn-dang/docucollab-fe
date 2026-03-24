"use client";

import { Document } from "@/lib/services/document.service";
import DocumentCard from "./DocumentCard";

interface DocumentSectionProps {
  title: string;
  icon?: React.ReactNode;
  documents: Document[];
  viewMode: "grid" | "list";
  onDelete: (doc: Document) => void;
  getDocumentTypeName: (typeId?: string) => string | null;
  getDocumentTypeColor: (typeId?: string) => string;
  getUserRoleForDocument: (doc: Document) => { role: string; color: string };
  getCollaboratorCount: (doc: Document) => number;
  getViewerCount: (doc: Document) => number;
}

export default function DocumentSection({
  title,
  icon,
  documents,
  viewMode,
  onDelete,
  getDocumentTypeName,
  getDocumentTypeColor,
  getUserRoleForDocument,
  getCollaboratorCount,
  getViewerCount,
}: DocumentSectionProps) {
  if (documents.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h2>
      <div
        className={
          viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
        }
      >
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            documentTypeName={getDocumentTypeName(doc.documentTypeId) ?? ""}
            documentTypeColor={getDocumentTypeColor(doc.documentTypeId)}
            onDelete={() => onDelete(doc)}
            viewMode={viewMode}
            collaboratorCount={getCollaboratorCount(doc)}
            viewerCount={getViewerCount(doc)}
            userRole={getUserRoleForDocument(doc)}
          />
        ))}
      </div>
    </div>
  );
}
