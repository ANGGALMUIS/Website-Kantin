import api from "./axios";

export const getAllCanteens = () => api.get("/canteens");

export const getCanteenById = (id) => api.get(`/canteens/${id}`);

export const getCanteenMenus = (id) => api.get(`/canteens/${id}/menus`);

export const getCanteenStats = () => api.get("/canteens/stats");

export const getRevenueChart = () => api.get("/canteens/dashboard/chart");

export const getMyCanteen = () => api.get("/canteens/profile");

export const updateMyCanteen = (data) => api.patch("/canteens/profile", data);

export const updateCanteenStatus = (isOpen) =>
  api.patch("/canteens/me/status", {
    isOpen,
  });
