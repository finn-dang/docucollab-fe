import axiosInstance from "../axios";

export interface Menu {
  id: string;
  name: string;
  label: string;
  description?: string;
  icon?: string;
  path: string;
  type: string;
  isActive: boolean;
  hidden: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMenuDto {
  name: string;
  label: string;
  description?: string;
  icon?: string;
  path: string;
  type: string;
  isActive?: boolean;
  hidden?: boolean;
}

export interface UpdateMenuDto {
  name?: string;
  label?: string;
  description?: string;
  icon?: string;
  path?: string;
  type?: string;
  isActive?: boolean;
  hidden?: boolean;
}

const menuService = {
  getAll: async (): Promise<Menu[]> => {
    const response = await axiosInstance.get("/administration/menus");
    return response.data.data;
  },

  getById: async (id: string): Promise<Menu> => {
    const response = await axiosInstance.get(`/administration/menus/${id}`);
    return response.data.data;
  },

  create: async (data: CreateMenuDto): Promise<Menu> => {
    const response = await axiosInstance.post("/administration/menus", data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateMenuDto): Promise<Menu> => {
    const response = await axiosInstance.patch(`/administration/menus/${id}`, data);
    return response.data.data;
  },

  deleteMenu: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/administration/menus/${id}`);
  },
};

export default menuService;
export { menuService };
