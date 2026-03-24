"use client";

import { Document } from "@/lib/services/document.service";
import DocumentCard from "./DocumentCard";

interface DocumentGridProps {
  documents: Document[];
  getDocumentTypeName: (typeId?: string) => string | null;
  getDocumentTypeColor: (typeId?: string) => string;
  getUserRoleForDocument: (doc: Document) => { role: string; color: string };
  getCollaboratorCount: (doc: Document) => number;
  getViewerCount: (doc: Document) => number;
  onDelete: (doc: Document) => void;
}

export default function DocumentGrid({
  documents,
  getDocumentTypeName,
  getDocumentTypeColor,
  getUserRoleForDocument,
  getCollaboratorCount,
  getViewerCount,
  onDelete,
}: DocumentGridProps) {
  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          documentTypeName={getDocumentTypeName(doc.documentTypeId) ?? ""}
          documentTypeColor={getDocumentTypeColor(doc.documentTypeId)}
          onDelete={() => onDelete(doc)}
          viewMode="grid"
          collaboratorCount={getCollaboratorCount(doc)}
          viewerCount={getViewerCount(doc)}
          userRole={getUserRoleForDocument(doc)}
        />
      ))}
    </div>
  );
}
