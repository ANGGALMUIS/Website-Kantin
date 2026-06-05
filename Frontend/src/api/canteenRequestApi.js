import api from "./axios";

export const createCanteenRequest = (data) => api.post("/canteen-requests", data);

export const getMyRequest = () => api.get("/canteen-requests/me");
