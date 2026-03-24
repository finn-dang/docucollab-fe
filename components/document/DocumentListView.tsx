// components/document/DocumentListView.tsx
"use client";

import { Document } from "@/lib/services/document.service";
import DocumentCard from "./DocumentCard";

interface DocumentListViewProps {
  documents: Document[];
  getDocumentTypeName: (typeId?: string) => string | null;
  getDocumentTypeColor: (typeId?: string) => string;
  getUserRoleForDocument: (doc: Document) => { role: string; color: string };
  getCollaboratorCount: (doc: Document) => number;
  getViewerCount: (doc: Document) => number;
  onDelete: (doc: Document) => void;
}

export default function DocumentListView({
  documents,
  getDocumentTypeName,
  getDocumentTypeColor,
  getUserRoleForDocument,
  getCollaboratorCount,
  getViewerCount,
  onDelete,
}: DocumentListViewProps) {
  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          documentTypeName={getDocumentTypeName(doc.documentTypeId) ?? ""}
          documentTypeColor={getDocumentTypeColor(doc.documentTypeId)}
          onDelete={() => onDelete(doc)}
          viewMode="list"
          collaboratorCount={getCollaboratorCount(doc)}
          viewerCount={getViewerCount(doc)}
          userRole={getUserRoleForDocument(doc)}
        />
      ))}
    </div>
  );
}
