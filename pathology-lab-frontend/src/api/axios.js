// src/api/axios.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --------- PUBLIC ROUTES (NO TOKEN NEEDED) ----------
const PUBLIC_ENDPOINTS = [
  "/auth/login/",
  "/staff/login/",
];

// ------ Helper: Check if a URL is public -------
function isPublicUrl(url) {
  return PUBLIC_ENDPOINTS.some((pub) => url.includes(pub));
}

// =====================================================
//   REQUEST INTERCEPTOR → Attach Access Token
// =====================================================
axiosInstance.interceptors.request.use((config) => {
  if (!isPublicUrl(config.url)) {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// =====================================================
//   RESPONSE INTERCEPTOR → Auto-refresh Access Token
// =====================================================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,

  async (error) => {
    const originalRequest = error.config;

    // If unauthorized AND we have refresh token, try refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        // No refresh → full logout
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/staff/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${baseURL}/auth/refresh/`, {
          refresh,
        });

        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);

        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccess}`;

        processQueue(null, newAccess);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Full logout
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/staff/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
