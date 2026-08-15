import axios from "axios";

import { AUTH_ERROR_CODES } from "./auth-error-codes";
import { API_ENDPOINTS } from "./endpoints";
import { ROUTES } from "@/config/routes";
import { clearAuthSession, useAuthStore } from "@/store";
import type { ApiResponse, BackendAuthPayload } from "@/types";
import { mapAuthPayload } from "@/types";

export const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = authClient
      .post<ApiResponse<BackendAuthPayload>>(API_ENDPOINTS.AUTH.REFRESH)
      .then((response) => {
        const envelope = response.data;
        const session = mapAuthPayload(envelope.data);
        useAuthStore.getState().setSession(session);
        return session.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response.data?.data !== undefined ? response.data.data : response.data,
  async (error) => {
    const originalRequest = error.config;
    const errorCode = error.response?.data?.code;

    const shouldRefresh =
      error.response?.status === 401 &&
      errorCode === AUTH_ERROR_CODES.ACCESS_TOKEN_EXPIRED &&
      !originalRequest._retry;

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAuthSession();
      if (typeof window !== "undefined") {
        window.location.replace(ROUTES.LOGIN);
      }
      return Promise.reject(refreshError);
    }
  }
);
