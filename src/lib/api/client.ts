import axios, { AxiosError, AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://34.200.19.255:8000";
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const message = error.response?.data 
      ? (error.response.data as { detail?: string }).detail || "An error occurred"
      : error.message;
    
    console.error(`[API] Error: ${message}`);
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
