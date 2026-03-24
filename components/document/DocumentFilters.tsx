// components/document/DocumentFilters.tsx
"use client";

import { Globe, Lock, Plus } from "lucide-react";

interface DocumentFiltersProps {
  selectedPrivacy: "all" | "public" | "private";
  onPrivacyChange: (privacy: "all" | "public" | "private") => void;
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
  availableTags: string[];
  onCreateNew: () => void;
}

export default function DocumentFilters({
  selectedPrivacy,
  onPrivacyChange,
  selectedTag,
  onTagChange,
  availableTags,
  onCreateNew,
}: DocumentFiltersProps) {
  return (
    <div className="mt-4">
      {/* Privacy Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onPrivacyChange("all")}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedPrivacy === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => onPrivacyChange("public")}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedPrivacy === "public"
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" /> Public
          </span>
        </button>
        <button
          onClick={() => onPrivacyChange("private")}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedPrivacy === "private"
              ? "bg-yellow-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" /> Private
          </span>
        </button>
      </div>

      {/* Create Button */}
      <div className="w-full my-8">
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Document</span>
        </button>
      </div>

      {/* Tags Filter */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => onTagChange(null)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              !selectedTag
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Types
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagChange(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTag === tag
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
