// components/document/DocumentEmptyState.tsx
"use client";

import { FileText } from "lucide-react";

interface DocumentEmptyStateProps {
  hasFilters: boolean;
  isOwnedTab: boolean;
  onCreateNew: () => void;
}

export default function DocumentEmptyState({
  hasFilters,
  isOwnedTab,
  onCreateNew,
}: DocumentEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <FileText className="w-24 h-24 mx-auto text-gray-300 mb-4 stroke-[1.5]" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
      <p className="text-gray-500 mb-4">
        {hasFilters
          ? "Try adjusting your search or filters"
          : isOwnedTab
            ? "Create your first document to get started"
            : "No documents shared with you in this section yet"}
      </p>
      {!hasFilters && isOwnedTab && (
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Create New Document
        </button>
      )}
    </div>
  );
}
