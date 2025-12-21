import axios, { AxiosInstance } from 'axios';
import { getRefreshToken, setAccessToken, setRefreshToken } from './TokenStorage';


let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessToken = async (instance?: AxiosInstance): Promise<string | null> => {
  if (isRefreshing && refreshPromise) return refreshPromise; // reuse ongoing refresh

  isRefreshing = true;
  const axiosInstance = instance || axios;

  refreshPromise = (async () => {
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return null;

      const { data } = await axiosInstance.post("/api/v1/auth/refresh-token", { refreshToken });

      await setAccessToken(data.accessToken);
      await setRefreshToken(data.refreshToken);

      return data.accessToken;
    } catch (err) {
      console.warn("Failed to refresh token:", err);
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};