"use client";

import { Document } from "@/lib/services/document.service";
import { format } from "date-fns";
import { truncateText, stripHtml } from "@/utils/html";
import { useRouter } from "next/navigation";
import { FileText, Globe, Lock, Users, Eye, Trash2 } from "lucide-react";

interface DocumentCardProps {
  document: Document;
  documentTypeName: string | null;
  documentTypeColor: string;
  onDelete: () => void;
  viewMode: "grid" | "list";
  collaboratorCount: number;
  viewerCount: number;
  userRole: { role: string; color: string };
}

export default function DocumentCard({
  document,
  documentTypeName,
  documentTypeColor,
  onDelete,
  viewMode,
  collaboratorCount,
  viewerCount,
  userRole,
}: DocumentCardProps) {
  const router = useRouter();

  const handleCardClick = () => router.push(`/documents/${document.id}`);
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const PrivacyIcon = document.privacy === "public" ? Globe : Lock;
  const privacyColor =
    document.privacy === "public" ? "text-green-600 bg-green-50" : "text-yellow-600 bg-yellow-50";

  if (viewMode === "list") {
    return (
      <div
        onClick={handleCardClick}
        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-gray-900">{document.title}</h3>
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${privacyColor}`}
                >
                  <PrivacyIcon className="w-3 h-3" />
                  {document.privacy === "public" ? "Public" : "Private"}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${userRole.color}`}
                >
                  {userRole.role}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 flex-wrap">
                <span>Updated {format(new Date(document.updatedAt), "MMM d, yyyy")}</span>
                {collaboratorCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {collaboratorCount} editor{collaboratorCount !== 1 ? "s" : ""}
                  </span>
                )}
                {viewerCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {viewerCount} viewer{viewerCount !== 1 ? "s" : ""}
                  </span>
                )}
                {documentTypeName && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${documentTypeColor}`}>
                    {documentTypeName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleDeleteClick}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer border border-gray-100 group"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${privacyColor}`}
            >
              <PrivacyIcon className="w-3 h-3" />
              {document.privacy === "public" ? "Public" : "Private"}
            </span>
            <button
              onClick={handleDeleteClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{document.title}</h2>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {truncateText(stripHtml(document.content), 100)}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span>Updated {format(new Date(document.updatedAt), "MMM d, yyyy")}</span>
          {documentTypeName && (
            <span className={`px-2 py-0.5 rounded-full ${documentTypeColor}`}>
              {documentTypeName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          {collaboratorCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Users className="w-3.5 h-3.5" />
              {collaboratorCount}
            </div>
          )}
          {viewerCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Eye className="w-3.5 h-3.5" />
              {viewerCount}
            </div>
          )}
          <div className={`ml-auto text-xs px-2 py-0.5 rounded-full ${userRole.color}`}>
            {userRole.role}
          </div>
        </div>
      </div>
    </div>
  );
}
