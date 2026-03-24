"use client";

interface WelcomeSectionProps {
  ownedCount: number;
  collaboratedCount: number;
  viewedCount: number;
}

export default function WelcomeSection({
  ownedCount,
  collaboratedCount,
  viewedCount,
}: WelcomeSectionProps) {
  const total = ownedCount + collaboratedCount + viewedCount;

  return (
    <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
          <p className="text-gray-600">
            You have {total} document{total !== 1 ? "s" : ""} total
          </p>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="text-purple-600">📄 Owned: {ownedCount}</span>
            <span className="text-blue-600">✏️ Can Edit: {collaboratedCount}</span>
            <span className="text-gray-500">👁️ View Only: {viewedCount}</span>
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20" />
        </div>
      </div>
    </div>
  );
}
