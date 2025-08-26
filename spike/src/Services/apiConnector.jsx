import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000/api/v1";
console.log("[API] Base URL:", BASE_URL);

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10s
  
  withCredentials: true, // 👈 VERY IMPORTANT (send cookies with requests)
});

// Request interceptor (no need to attach token anymore)
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Dispatch logout action
      // e.g. store.dispatch({ type: "LOGOUT" });
      
      // Optional: navigate only if not already on login page
      if (window.location.pathname !== "/login") {
        // don’t use full reload
        window.history.pushState({}, "", "/login");
      }
    }
    return Promise.reject(error);
  }
);


export const apiConnector = (method, url, bodyData, headers = {}, params = {}) => {
  return axiosInstance({
    method,
    url,
    data: bodyData || undefined,
    headers: {
      ...headers,
      ...(bodyData instanceof FormData ? {} : { "Content-Type": "application/json" }),
    },
    params,
  });
};

