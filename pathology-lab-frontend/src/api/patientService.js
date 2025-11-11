// src/api/patientService.js
import api from "./apiClient";

export const getPatients = async () => {
  const response = await api.get("/patients/");
  return response.data;
};
