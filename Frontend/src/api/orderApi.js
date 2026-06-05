import api from "./axios";

export const createOrder = (data) => api.post("/orders", data);

export const getMyOrders = () => api.get("/orders/my");

export const getOrderHistory = () => api.get("/orders/history");

export const getCanteenOrders = () => api.get("/orders/canteen");

export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status });