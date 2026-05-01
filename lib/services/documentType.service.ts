import axiosInstance from "@/lib/axios";

export interface DocumentType {
  id: string;
  name: string;
  description: string;
}

export const documentTypeService = {
  getAll: async (): Promise<DocumentType[]> => {
    const response = await axiosInstance.get("/document-types");
    return response.data.data;
  },
};
