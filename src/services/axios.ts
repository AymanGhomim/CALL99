import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "../types/api";
import type { AuthSession } from "../store/authStore";
import { useAuthStore } from "../store/authStore";

const baseURL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

if (!baseURL) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

const api = axios.create({
  baseURL,
  timeout: 20_000,
});

const refreshClient = axios.create({ baseURL, timeout: 20_000 });
let refreshPromise: Promise<string> | null = null;

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("Refresh token is missing");

  const response = await refreshClient.post<ApiResponse<AuthSession>>("/auth/refresh", { refreshToken });
  useAuthStore.getState().setAuth(response.data.data);
  return response.data.data.accessToken;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequestConfig | undefined;
    const isAuthRequest = request?.url?.startsWith("/auth/") ?? false;

    if (error.response?.status !== 401 || !request || request._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const accessToken = await refreshPromise;
      request.headers.Authorization = `Bearer ${accessToken}`;
      return api(request);
    } catch (refreshError) {
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
