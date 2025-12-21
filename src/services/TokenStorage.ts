import * as SecureStore from "expo-secure-store";

let currentAccessToken: string | null = null;

export const getAccessToken = (): Promise<string | null> => {
  return SecureStore.getItemAsync("token");
};

export const getRefreshToken = (): Promise<string | null> => {
  return SecureStore.getItemAsync("refreshToken");
};

export const setAccessToken = (token: string | null): Promise<void> => {
    currentAccessToken = token;
  return token
    ? SecureStore.setItemAsync("token", token)
    : SecureStore.deleteItemAsync("token");
};

export const setRefreshToken = (token: string | null): Promise<void> => {
  return token
    ? SecureStore.setItemAsync("refreshToken", token)
    : SecureStore.deleteItemAsync("refreshToken");
};
