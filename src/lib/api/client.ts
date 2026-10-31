import axios, { type InternalAxiosRequestConfig } from "axios";

import { authBroadcaster } from "./auth-broadcast";
import { AUTH_ERROR_CODES } from "./auth-error-codes";
import { API_ENDPOINTS } from "./endpoints";
import { normalizeApiError } from "./error-handler";
import { env } from "@/config/env";
import { ROUTES } from "@/config/routes";
import { clearAuthSession, useAuthStore } from "@/store";
import type { ApiResponse, BackendAuthPayload } from "@/types";
import { mapAuthPayload } from "@/types";

const BACKEND_API_URL = env.NEXT_PUBLIC_BACKEND_API_URL;

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const authClient = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const apiClient = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export function googleAuthUrl(): string {
  return `${BACKEND_API_URL}${API_ENDPOINTS.AUTH.GOOGLE}`;
}

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

if (typeof window !== "undefined") {
  authBroadcaster.subscribe((message) => {
    if (message.type === "AUTH_REFRESH_START") {
      if (!refreshPromise) {
        refreshPromise = new Promise<string>((resolve, reject) => {
          const timeout = setTimeout(() => {
            unsubscribe();
            reject(new Error("Multi-tab refresh timeout"));
          }, 10000);

          const unsubscribe = authBroadcaster.subscribe((innerMsg) => {
            if (innerMsg.type === "AUTH_REFRESH_SUCCESS") {
              clearTimeout(timeout);
              unsubscribe();
              resolve(innerMsg.accessToken);
            } else if (innerMsg.type === "AUTH_REFRESH_FAILED" || innerMsg.type === "AUTH_LOGOUT") {
              clearTimeout(timeout);
              unsubscribe();
              reject(new Error("Multi-tab refresh failed"));
            }
          });
        }).finally(() => {
          refreshPromise = null;
        });
      }
    } else if (message.type === "AUTH_LOGOUT") {
      clearAuthSession();
      if (typeof window !== "undefined" && window.location.pathname !== ROUTES.LOGIN) {
        window.location.replace(ROUTES.LOGIN);
      }
    }
  });
}

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    authBroadcaster.postMessage({ type: "AUTH_REFRESH_START" });

    refreshPromise = authClient
      .post<ApiResponse<BackendAuthPayload>>(API_ENDPOINTS.AUTH.REFRESH)
      .then((response) => {
        const envelope = response.data;
        const session = mapAuthPayload(envelope.data);
        useAuthStore.getState().setSession(session);
        authBroadcaster.postMessage({
          accessToken: session.accessToken,
          type: "AUTH_REFRESH_SUCCESS",
        });
        return session.accessToken;
      })
      .catch((error) => {
        authBroadcaster.postMessage({ type: "AUTH_REFRESH_FAILED" });
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => (response.data?.data !== undefined ? response.data.data : response.data),
  async (error) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const errorCode = error.response?.data?.code;

    const shouldRefresh =
      error.response?.status === 401 &&
      errorCode === AUTH_ERROR_CODES.ACCESS_TOKEN_EXPIRED &&
      !originalRequest?._retry;

    if (!shouldRefresh || !originalRequest) {
      return Promise.reject(normalizeApiError(error));
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      const normalized = normalizeApiError(refreshError);
      if (normalized.status === 401) {
        clearAuthSession();
        authBroadcaster.postMessage({ type: "AUTH_LOGOUT" });
        if (typeof window !== "undefined") {
          window.location.replace(ROUTES.LOGIN);
        }
      }
      return Promise.reject(normalized);
    }
  }
);
