import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "../context/Auth/AcessToken";
import { rotateToken } from "../features/auth/services/auth.services";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const api = axios.create({
  baseURL: "http://localhost:5000/",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

interface QueueType {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueType[] = [];

function processQueue(error: unknown, token: string | null) {
  for (const request of failedQueue) {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  }
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as InternalAxiosRequestConfig;

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url === "/api/auth/rotate") {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const result = await rotateToken();

      setAccessToken(result.accessToken);

      processQueue(null, result.accessToken);

      return api(originalRequest);
    } catch (error) {
      processQueue(error, null);

      clearAccessToken();

      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
