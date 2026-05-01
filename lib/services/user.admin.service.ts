import axiosInstance from "../axios";

export interface Role {
  id: string;
  name: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  roles: Role[];
  createdAt?: string;
  updatedAt?: string;
  startDate?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  roleIds?: string[]; // ✅ Fixed: array of role IDs
  displayName?: string;
  startDate?: string;
  phone?: string;
  address?: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  displayName?: string;
  startDate?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
  roleIds?: string[];
  updatedBy?: string;
}

export interface SearchUsersParams {
  page?: number;
  limit?: number;
  username?: string;
  email?: string;
}

export interface SearchUsersResponse {
  data: AdminUser[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

const userAdminService = {
  search: async (params: SearchUsersParams): Promise<SearchUsersResponse> => {
    const response = await axiosInstance.get("/administration/users/search", {
      params,
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  create: async (data: CreateUserDto): Promise<AdminUser> => {
    const response = await axiosInstance.post("/administration/users", data);
    return response.data.data;
  },

  getById: async (id: string): Promise<AdminUser> => {
    const response = await axiosInstance.get(`/administration/users/${id}`);
    return response.data.data;
  },

  update: async (id: string, data: UpdateUserDto): Promise<AdminUser> => {
    const response = await axiosInstance.put(`/administration/users/${id}`, data);
    return response.data.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/administration/users/${id}`);
  },

  updateRole: async (userId: string, roleIds: string[]): Promise<void> => {
    await axiosInstance.patch(`/administration/users/${userId}/role`, {
      roleIds,
    });
  },
};

export default userAdminService;
export { userAdminService };
