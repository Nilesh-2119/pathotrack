// src/api/dashboardService.js
import api from "./apiClient";

export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary/");
  return response.data;
};
