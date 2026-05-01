import axiosInstance from "../axios";

export interface Notification {
  id: string;
  userId: string;
  type: "collaborator_added" | "viewer_added" | "mention" | "document_shared";
  documentId: string;
  actorId: string;
  message: string;
  isRead: boolean;
  metadata: {
    documentTitle?: string;
    role?: string;
    actorName?: string;
  };
  createdAt: string;
}

export const notificationService = {
  // Get all notifications for current user
  getNotifications: async (page: number = 1, limit: number = 20) => {
    const response = await axiosInstance.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await axiosInstance.get("/notifications/unread-count");
    return response.data.data.count;
  },

  // Mark as read
  markAsRead: async (id: string) => {
    await axiosInstance.patch(`/notifications/${id}/read`);
  },

  // Mark all as read
  markAllAsRead: async () => {
    await axiosInstance.patch("/notifications/mark-all-read");
  },
};
