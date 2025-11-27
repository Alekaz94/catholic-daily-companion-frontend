import axios, { AxiosInstance, AxiosError, AxiosHeaders, AxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { refreshAccessToken } from './TokenService';
import * as SecureStore from 'expo-secure-store';
import { getAuthHeader, setAuthToken } from "./AuthTokenManager";
import { applyOfflineInterceptor } from '../api/axiosOfflineGuard';
import Toast from 'react-native-root-toast';
import { clearSession } from './SessionService';

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const API = axios.create({ baseURL: API_BASE_URL });
export const refreshAPI = axios.create({ baseURL: API_BASE_URL });

applyOfflineInterceptor(API);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (error: any) => void; config: AxiosRequestConfigWithRetry }> = [];
let logoutToastShown = false;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      if (token && prom.config.headers) {
        (prom.config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
      }
      prom.resolve(API(prom.config));
    }
  });
  failedQueue = [];
};

API.interceptors.request.use(async (config) => {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  const authHeader = await getAuthHeader();

  Object.entries(authHeader).forEach(([key, value]) => {
    (config.headers as AxiosHeaders).set(key, value);
  });

  return config;
});

export const setupInterceptors = (logout: () => Promise<void>) => {
  API.interceptors.response.use(
    (response) => response,
    async (error: AxiosError & { isOffline?: boolean }) => {
      const originalRequest = error.config as AxiosRequestConfigWithRetry;

      if (error.isOffline) return Promise.reject(error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        if (!logoutToastShown) {
          logoutToastShown = true;
          Toast.show(
            (error.response?.data as any)?.message || "Session expired. Please log in again.",
            { duration: Toast.durations.LONG, position: Toast.positions.TOP }
          );
          await logout();
          logoutToastShown = false;
        }

        return Promise.resolve({ data: null });
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshed = await refreshAccessToken(refreshAPI);

          if (refreshed) {
            const token = await SecureStore.getItemAsync("token");
            setAuthToken(token);
            processQueue(null, token);

            if (!originalRequest.headers) originalRequest.headers = new AxiosHeaders();
            (originalRequest.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
            return API(originalRequest);
          } else {
            processQueue(error, null);
            return Promise.resolve({ data: null });
          }
        } catch (err) {
          processQueue(err, null);
          return Promise.resolve({ data: null });
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

export default API;
