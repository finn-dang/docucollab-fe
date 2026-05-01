"use client";

import { Notification } from "@/lib/services/notification.service";
import { formatDistanceToNow } from "date-fns";
import { Check, CheckCheck, Trash2, FileText, UserPlus, Eye, AtSign, Bell } from "lucide-react";
import Link from "next/link";

interface NotificationDropdownProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "collaborator_added":
      return <UserPlus className="w-4 h-4 text-purple-500" />;
    case "viewer_added":
      return <Eye className="w-4 h-4 text-blue-500" />;
    case "mention":
      return <AtSign className="w-4 h-4 text-yellow-500" />;
    default:
      return <FileText className="w-4 h-4 text-gray-500" />;
  }
};

export default function NotificationDropdown({
  notifications,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClose,
}: NotificationDropdownProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1"
          >
            <CheckCheck className="w-3 h-3" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`relative border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                !notification.isRead ? "bg-purple-50/30" : ""
              }`}
            >
              <div className="p-4">
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/documents/${notification.documentId}`}
                      onClick={onClose}
                      className="block"
                    >
                      <p
                        className={`text-sm ${!notification.isRead ? "font-semibold text-gray-900" : "text-gray-600"}`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </Link>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {!notification.isRead && (
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(notification.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Unread indicator dot */}
              {!notification.isRead && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full"></div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
          <Link
            href="/notifications"
            onClick={onClose}
            className="block text-center text-xs text-purple-600 hover:text-purple-700 transition-colors"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
