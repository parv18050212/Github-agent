import axios, { AxiosError, AxiosInstance } from "axios";
import { supabase } from "@/lib/supabaseClient";

// API Configuration
const isDevelopment = import.meta.env.DEV;
const API_URL = import.meta.env.VITE_API_URL || (isDevelopment ? "" : "http://localhost:8000");
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;
const DEBUG = import.meta.env.VITE_DEBUG === "true";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  async (config) => {
    if (DEBUG) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
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
    if (DEBUG) {
      console.log(`[API] Response ${response.status}:`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    const message = error.response?.data
      ? (error.response.data as { detail?: string }).detail || "An error occurred"
      : error.message;

    console.error(`[API] Error: ${message}`);

    // Handle specific error codes
    if (error.response?.status === 401) {
      console.error("[API] Unauthorized - authentication required");
    } else if (error.response?.status === 403) {
      console.error("[API] Forbidden - insufficient permissions");
    } else if (error.response?.status === 404) {
      console.error("[API] Not found");
    } else if (error.response?.status === 500) {
      console.error("[API] Server error");
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
