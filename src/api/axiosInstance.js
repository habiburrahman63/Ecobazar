import axios from "axios";

export const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).trim().replace(/\/+$/, "");

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, clean up token if appropriate
    if (error.response && error.response.status === 401) {
      // If server explicitly reports invalid/expired token on protected requests
      const message = error.response.data?.message || "";
      if (
        message.toLowerCase().includes("expired") ||
        message.toLowerCase().includes("invalid token")
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("userinfo");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

