import api from "./axios";
export const getMe = () => api.get("/auth/me");

export const loginApi = (data) => api.post("/auth/login", data);

export const registerApi = (data) => api.post("/auth/register", data);

export const getMeApi = () => api.get("/auth/me");

export const googleLoginApi = (credential) =>
  api.post("/auth/google", {
    credential,
  });
