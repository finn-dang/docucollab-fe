import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

export interface Collaborator {
  id: string;
  username: string;
  displayName: string;
  email: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  collaborators: string[] | Collaborator[];
  viewers?: string[] | Collaborator[];
  privacy?: "public" | "private";
  documentTypeId?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentDto {
  title: string;
  content: string;
  ownerId: string;
  collaborators: string[];
  viewers?: string[];
  privacy?: "public" | "private";
  documentTypeId?: string;
}

export interface UpdateDocumentDto {
  title?: string;
  content?: string;
  collaborators?: string[];
  viewers?: string[];
  privacy?: "public" | "private";
  documentTypeId?: string;
}

export interface AllUserDocumentsResponse {
  owned: Document[];
  collaborated: Document[];
  viewed: Document[];
}

export const documentService = {
  // Get documents owned by user
  getByOwnerId: async (ownerId: string): Promise<Document[]> => {
    try {
      const response = await axiosInstance.get(`/document/owner/${ownerId}`);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // ✅ NEW: Get documents where user is a collaborator (can edit)
  getByCollaborator: async (userId: string): Promise<Document[]> => {
    try {
      const response = await axiosInstance.get(`/document/collaborator/${userId}`);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // ✅ NEW: Get documents where user is a viewer (read-only)
  getByViewer: async (userId: string): Promise<Document[]> => {
    try {
      const response = await axiosInstance.get(`/document/viewer/${userId}`);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // ✅ Get all user documents (combined)
  getAllUserDocuments: async (userId: string): Promise<AllUserDocumentsResponse> => {
    const [owned, collaborated, viewed] = await Promise.all([
      documentService.getByOwnerId(userId),
      documentService.getByCollaborator(userId),
      documentService.getByViewer(userId),
    ]);
    return { owned, collaborated, viewed };
  },

  getById: async (id: string): Promise<Document> => {
    const response = await axiosInstance.get(`/document/${id}`);
    return response.data.data;
  },

  create: async (data: CreateDocumentDto): Promise<Document> => {
    const response = await axiosInstance.post("/document", data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateDocumentDto): Promise<Document> => {
    const response = await axiosInstance.patch(`/document/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/document/${id}`);
  },
  // Add to existing documentService

  // ✅ NEW: Get all documents (Admin only)
  getAllDocuments: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    privacy?: "public" | "private";
    isDeleted?: boolean;
  }): Promise<{ data: Document[]; total: number; page: number; limit: number }> => {
    const response = await axiosInstance.get("/document/admin/all", { params });
    return {
      data: response.data.data,
      total: response.data.meta?.total || 0,
      page: response.data.meta?.page || 1,
      limit: response.data.meta?.limit || 10,
    };
  },

  // ✅ NEW: Restore soft-deleted document
  restoreDocument: async (id: string): Promise<Document> => {
    const response = await axiosInstance.patch(`/document/${id}/restore`);
    return response.data.data;
  },

  // ✅ NEW: Permanently delete document
  permanentlyDelete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/document/${id}/permanent`);
  },
};
