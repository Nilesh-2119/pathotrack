// src/api/testService.js
import api from "./apiClient";

export const fetchTests = async () => {
  const res = await api.get("/tests/");
  return res.data;
};

export const addTest = async (test) => {
  const res = await api.post("/tests/", test);
  return res.data;
};

export const updateTest = async (id, test) => {
  const res = await api.put(`/tests/${id}/`, test);
  return res.data;
};

export const deleteTest = async (id) => {
  await api.delete(`/tests/${id}/`);
};
