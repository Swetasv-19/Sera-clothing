import axios from "axios";

const api = axios.create({
  baseURL: (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  ).endsWith("/")
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api") + "/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add token to request
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor to handle errors (like token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (
          !window.location.pathname.startsWith("/admin/login") &&
          !window.location.pathname.startsWith("/auth/login")
        ) {
          window.location.href = window.location.pathname.startsWith("/admin")
            ? "/admin/login"
            : "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
