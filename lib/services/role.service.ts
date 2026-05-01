import axiosInstance from "../axios";

export interface Role {
  id: string;
  name: string;
  description?: string;
  menus?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
}

export interface UpdateRoleMenusDto {
  menuIds: string[];
}

const roleService = {
  getAll: async (): Promise<Role[]> => {
    const response = await axiosInstance.get("/administration/roles");
    return response.data.data;
  },

  getById: async (id: string): Promise<Role> => {
    const response = await axiosInstance.get(`/administration/roles/${id}`);
    return response.data.data;
  },

  create: async (data: CreateRoleDto): Promise<Role> => {
    const response = await axiosInstance.post("/administration/roles", data);
    return response.data.data;
  },

  deleteRole: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/administration/roles/${id}`);
  },

  updateMenus: async (roleId: string, menuIds: string[]): Promise<void> => {
    await axiosInstance.patch(`/administration/roles/${roleId}/menus`, {
      menuIds,
    });
  },
};

export default roleService;
export { roleService };
