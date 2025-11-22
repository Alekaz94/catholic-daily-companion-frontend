import axios, { AxiosInstance, AxiosError, AxiosHeaders, AxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { refreshAccessToken } from './TokenService';
import * as SecureStore from 'expo-secure-store';
import { getAuthHeader, setAuthToken } from "./AuthTokenManager";
import { applyOfflineInterceptor } from '../api/axiosOfflineGuard';

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

console.log('BASE URL:', API_BASE_URL);

const API = axios.create({ baseURL: API_BASE_URL });
export const refreshAPI = axios.create({ baseURL: API_BASE_URL });

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

applyOfflineInterceptor(API);

API.interceptors.response.use(
  (res) => res,
  async (error: AxiosError & { isOffline?: boolean }) => {
    if (error.isOffline) {
      console.log("Offline request blocked:", error.message);
      return Promise.reject(error);
    }

    const originalRequest = error.config as AxiosRequestConfigWithRetry;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshed = await refreshAccessToken(refreshAPI);

      if (refreshed) {
        const token = await SecureStore.getItemAsync("token");
        setAuthToken(token);

        if (!originalRequest.headers) {
          originalRequest.headers = new AxiosHeaders();
        }

        (originalRequest.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
        return API(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
