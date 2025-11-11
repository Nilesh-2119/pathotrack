// src/api/authService.js
import api from "./apiClient";

// Register Lab Admin
export const registerLab = async (payload) => {
  return await api.post("/auth/register/", payload);
};

// Login user
export const loginUser = async ({ email, password }) => {
  // Django expects "username", not "email"
  const response = await api.post("/auth/login/", {
    username: email,
    password,
  });
  return response.data;
};

// Get logged-in user profile
export const getProfile = async () => {
  return await api.get("/auth/profile/");
};
