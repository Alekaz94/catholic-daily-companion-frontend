import axios, { AxiosHeaders } from 'axios';
import Constants from 'expo-constants';
import { refreshAccessToken } from './TokenService';
import * as SecureStore from 'expo-secure-store';
import { getAuthHeader, setAuthToken } from "./AuthTokenManager";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

console.log('BASE URL:', API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL,
});

const refreshAPI = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use(async (config) => {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  const authHeader = await getAuthHeader();
  
  for (const [key, value] of Object.entries(authHeader)) {
    (config.headers as AxiosHeaders).set(key, value);
  }

  return config;
})

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshed = await refreshAccessToken(refreshAPI);

      if (refreshed) {
        const token = await SecureStore.getItemAsync("token");
        setAuthToken(token);
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return API(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;
