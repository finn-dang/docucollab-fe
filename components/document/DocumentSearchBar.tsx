// components/document/DocumentSearchBar.tsx
"use client";

import { Search, Grid, List } from "lucide-react";

interface DocumentSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function DocumentSearchBar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: DocumentSearchBarProps) {
  return (
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
  );
}
