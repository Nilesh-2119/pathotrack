// src/api/testService.js
import api from "./apiClient";

/**
 * Helper functions to work with Test endpoints.
 * Backend expects `tube_names: ["EDTA", "Plain"]` on create/update.
 */

export async function fetchTests() {
  const res = await api.get("/tests/");
  return res.data;
}

export async function addTest(payload) {
  // payload: { name, price, category, description, unit, is_active, tube_names: [] }
  const res = await api.post("/tests/", payload);
  return res.data;
}

export async function updateTest(id, payload) {
  // payload same shape as addTest
  const res = await api.patch(`/tests/${id}/`, payload);
  return res.data;
}

export async function deleteTest(id) {
  const res = await api.delete(`/tests/${id}/`);
  return res.data;
}
