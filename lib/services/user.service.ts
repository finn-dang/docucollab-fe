import axiosInstance from "@/lib/axios";

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await axiosInstance.get("/administration/users");
    return response.data.data;
  },
};
