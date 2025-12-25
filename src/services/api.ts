import { AxiosError, AxiosHeaders, AxiosRequestConfig } from 'axios';
import { refreshAccessToken } from './TokenService';
import { applyOfflineInterceptor } from '../api/axiosOfflineGuard';
import Toast from 'react-native-root-toast';
import { API, refreshAPI } from './HttpClients';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from './TokenStorage';

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

applyOfflineInterceptor(API);

let logoutToastShown = false;
let isRefreshing = false;

type FailedRequest = {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  config: AxiosRequestConfigWithRetry;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      (config.headers as AxiosHeaders).set(
        "Authorization",
        `Bearer ${token}`
      );

      resolve(API(config));
    }
  });

  failedQueue = [];
};

const safeLogout = async (logout: () => Promise<void>) => {
  if (logoutToastShown) {
    return;
  }

  logoutToastShown = true;
  await logout();

  Toast.show("Session expired. Please log in again.", {
    duration: Toast.durations.LONG,
    position: Toast.positions.TOP,
  });

  logoutToastShown = false;
};

export const setupInterceptors = (logout: () => Promise<void>) => {

  API.interceptors.request.use(async (config) => {
    const token = await getAccessToken();

    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      (config.headers as AxiosHeaders).set(
        "Authorization",
        `Bearer ${token}`
      );
    }

    return config;
  });

  API.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfigWithRetry;

      if (
        originalRequest?.url?.includes("/auth/refresh-token") ||
        originalRequest?.url?.includes("/auth/logout")
      ) {
        return Promise.reject(error);
      }

      if (
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await getRefreshToken();
          if (!refreshToken) throw new Error("No refresh token");

          const response = await refreshAPI.post(
            "/api/v1/auth/refresh-token",
            { refreshToken }
          );

          const newAccessToken = response.data.token;
          const newRefreshToken = response.data.refreshToken;

          if (!newAccessToken || !newRefreshToken) {
            throw new Error("Invalid refresh response");
          }

          await setAccessToken(newAccessToken);
          await setRefreshToken(newRefreshToken);

          processQueue(null, newAccessToken);

          if (!originalRequest.headers) {
            originalRequest.headers = new AxiosHeaders();
          }

          (originalRequest.headers as AxiosHeaders).set(
            "Authorization",
            `Bearer ${newAccessToken}`
          );

          return API(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          await logout();

          Toast.show("Session expired. Please log in again.", {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
          });

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}

export default API;
