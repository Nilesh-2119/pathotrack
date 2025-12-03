// src/api/expenseService.js
import api from "./apiClient";

const EXPENSES_BASE = "/expenses/"; // axios base will prepend VITE_API_URL

export async function getExpenses(params = {}) {
  const res = await api.get(EXPENSES_BASE, { params });
  return res.data;
}

export async function createExpense(payload) {
  const res = await api.post(EXPENSES_BASE, payload);
  return res.data;
}

export async function getExpense(id) {
  const res = await api.get(`${EXPENSES_BASE}${id}/`);
  return res.data;
}

export async function updateExpense(id, payload) {
  const res = await api.put(`${EXPENSES_BASE}${id}/`, payload);
  return res.data;
}

export async function deleteExpense(id) {
  const res = await api.delete(`${EXPENSES_BASE}${id}/`);
  return res.data;
}
