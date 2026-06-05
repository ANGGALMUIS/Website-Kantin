import api from "./axios";

export const getMyMenus = () => api.get("/menus/my");

export const createMenu = (data) => api.post("/menus", data);

export const updateMenu = (id, data) => api.patch(`/menus/${id}`, data);

export const deleteMenu = (id) => api.delete(`/menus/${id}`);

export const updateMenuAvailability = (id, isAvailable) =>
  api.patch(`/menus/${id}/availability`, {
    isAvailable,
  });
