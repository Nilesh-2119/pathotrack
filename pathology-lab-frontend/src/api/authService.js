import axiosInstance from "./axios";
import jwtDecode from "jwt-decode";

export const login = async (credentials) => {
  const { data } = await axiosInstance.post("auth/login/", credentials);
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  return jwtDecode(data.access);
};

export const register = async (userData) => {
  const { data } = await axiosInstance.post("auth/register/", userData);
  return data;
};

export const getProfile = async () => {
  const { data } = await axiosInstance.get("auth/me/");
  return data;
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};
