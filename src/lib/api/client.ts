import axios from "axios";

import { ROUTES } from "@/config/routes";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/error-handler";
import { clearAuthSessionCookie, setAuthSessionCookie } from "@/lib/auth/session";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  setAuthSession,
} from "@/store/auth-store";
import type { AuthSession } from "@/types/auth.types";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  reject: (reason?: unknown) => void;
  resolve: (value: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const newSession = await axios.post<AuthSession>(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL ?? ""}${API_ENDPOINTS.AUTH.REFRESH}`,
            { refreshToken }
          ).then((res) => res.data);

          document.cookie = setAuthSessionCookie(newSession);
          setAuthSession(newSession);
          processQueue(null, newSession.accessToken);
          
          originalRequest.headers.Authorization = `Bearer ${newSession.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          processQueue(err, null);
          document.cookie = clearAuthSessionCookie();
          clearAuthSession();
          if (typeof window !== "undefined") {
            window.location.href = ROUTES.LOGIN;
          }
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
    }

    const message =
      error.response?.data?.error || error.message || "Request failed";
    throw new ApiError(message, error.response?.status || 500, error.response?.data);
  }
);

export const apiClient = {
  delete: <T>(url: string) => axiosInstance.delete<never, T>(url),
  get: <T>(url: string) => axiosInstance.get<never, T>(url),
  post: <T>(url: string, data?: unknown) =>
    axiosInstance.post<never, T>(url, data),
  put: <T>(url: string, data?: unknown) =>
    axiosInstance.put<never, T>(url, data),
};
