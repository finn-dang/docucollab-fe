"use client";

interface ActiveUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  cursor?: number;
}

interface ActiveUsersProps {
  users: ActiveUser[];
}

export default function ActiveUsers({ users }: ActiveUsersProps) {
  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {users.slice(0, 5).map((user) => (
          <div key={user.id} className="relative group">
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium ring-2 ring-white shadow-sm"
              title={user.name}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {user.name}
              {user.cursor && <span className="ml-1 text-gray-400">· editing</span>}
            </div>
          </div>
        ))}
      </div>
      {users.length > 5 && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium ring-2 ring-white">
          +{users.length - 5}
        </div>
      )}
      <span className="text-xs text-gray-500">
        {users.length} active{users.length !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
