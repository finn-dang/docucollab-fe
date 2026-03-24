"use client";

import { Search, Grid, List, Globe, Lock } from "lucide-react";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedPrivacy: "all" | "public" | "private";
  onPrivacyChange: (privacy: "all" | "public" | "private") => void;
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onCreateNew: () => void;
  availableTags: string[];
}

export default function SearchAndFilters({
  searchQuery,
  onSearchChange,
  selectedPrivacy,
  onPrivacyChange,
  selectedTag,
  onTagChange,
  viewMode,
  onViewModeChange,
  onCreateNew,
  availableTags,
}: SearchAndFiltersProps) {
  return (
    <div className="mb-6">
      {/* Search Bar & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Privacy Filter */}
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => onPrivacyChange("all")}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedPrivacy === "all" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          All
        </button>
        <button
          onClick={() => onPrivacyChange("public")}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedPrivacy === "public" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Public
          </span>
        </button>
        <button
          onClick={() => onPrivacyChange("private")}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedPrivacy === "private" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Private
          </span>
        </button>
      </div>

      {/* Create Button */}
      <div className="w-full my-8">
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Document</span>
        </button>
      </div>

      {/* Tags Filter */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => onTagChange(null)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${!selectedTag ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            All Types
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagChange(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === tag ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
