import api from "./axios";

export const getAdminStats = () => api.get("/admin/stats");

export const getPendingCanteens = () => api.get("/admin/canteens/pending");

export const approveCanteen = (id) => api.patch(`/admin/canteens/${id}/approve`);

export const rejectCanteen = (id) => api.patch(`/admin/canteens/${id}/reject`);

export const getPendingRequests = () => api.get("/admin/requests");

export const approveRequest = (id) => api.patch(`/admin/requests/${id}/approve`);

export const rejectRequest = (id) => api.patch(`/admin/requests/${id}/reject`);