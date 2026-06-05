import api from "./axios";

export const getDashboardStats = () => api.get("/canteens/dashboard/stats");
