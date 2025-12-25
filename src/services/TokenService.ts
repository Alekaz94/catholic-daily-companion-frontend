import { refreshAPI } from './HttpClients';
import { getRefreshToken, setAccessToken, setRefreshToken } from './TokenStorage';

const endpoint = "/api/v1/auth/"

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const response = await refreshAPI.post(
    "/api/v1/auth/refresh-token",
    { refreshToken }
  );

  const { token, refreshToken: newRefreshToken } = response.data ?? {};

  if (!token || !newRefreshToken) {
    return null;
  }

  await setAccessToken(token);
  await setRefreshToken(newRefreshToken);

  return token;
};