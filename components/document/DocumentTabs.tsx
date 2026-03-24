// components/document/DocumentTabs.tsx
"use client";

export type DocumentTab = "owned" | "collaborated" | "viewed";

interface DocumentTabsProps {
  activeTab: DocumentTab;
  onTabChange: (tab: DocumentTab) => void;
  counts: { owned: number; collaborated: number; viewed: number };
}

export default function DocumentTabs({ activeTab, onTabChange, counts }: DocumentTabsProps) {
  const tabs = [
    { id: "owned" as const, label: "📄 My Documents", count: counts.owned },
    { id: "collaborated" as const, label: "✏️ Can Edit", count: counts.collaborated },
    { id: "viewed" as const, label: "👁️ View Only", count: counts.viewed },
  ];

  return (
    <div className="flex gap-1 mb-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium transition-all rounded-t-lg ${
            activeTab === tab.id
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
}
