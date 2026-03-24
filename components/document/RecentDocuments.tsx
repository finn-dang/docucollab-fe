"use client";

import { Clock } from "lucide-react";
import { Document } from "@/lib/services/document.service";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface RecentDocumentsProps {
  documents: Document[];
  getDocumentTypeName: (typeId?: string) => string | null;
  getDocumentTypeColor: (typeId?: string) => string;
}

export default function RecentDocuments({
  documents,
  getDocumentTypeName,
  getDocumentTypeColor,
}: RecentDocumentsProps) {
  const router = useRouter();

  if (documents.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gray-600" />
          Recently edited
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => router.push(`/documents/${doc.id}`)}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-gray-900 line-clamp-1 flex-1">{doc.title}</h3>
              {doc.privacy === "public" ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  Public
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                  Private
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
              {doc.content || "No content yet"}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {format(new Date(doc.updatedAt), "MMM d, h:mm a")}
              </p>
              {getDocumentTypeName(doc.documentTypeId) && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${getDocumentTypeColor(doc.documentTypeId)}`}
                >
                  {getDocumentTypeName(doc.documentTypeId)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
