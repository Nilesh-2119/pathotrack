// src/api/apiClient.js
import axios from "axios";

// ✅ Base URL of your Django backend
const API_BASE_URL = "http://127.0.0.1:8000/api"; // change if your backend runs elsewhere

// ✅ Create Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Optional: Add Authorization header if JWT token exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
