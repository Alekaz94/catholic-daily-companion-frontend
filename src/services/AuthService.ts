import { jwtDecode } from 'jwt-decode';
import { NewUser, User } from "../models/User";
import * as SecureStore from 'expo-secure-store';
import API, { setAuthToken } from './api';
import { LoginResponse } from '../models/Login';

export const login = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  const res = await API.post<LoginResponse>('/api/v1/auth/login', { email, password });
  const { user, token, refreshToken } = res.data;

  if (!token || !refreshToken) {
    throw new Error('Login failed: Missing token or refresh token');
  }

  await storeSession(user, token, refreshToken);

  return { user, token };
};

export const signup = async (userToCreate: NewUser): Promise<{user: User; token: string}> => {
  const res = await API.post('/api/v1/auth/sign-up', userToCreate);
  const { user, token, refreshToken } = res.data;

  if (!token || !refreshToken) {
    throw new Error('Signup failed: Missing token or refresh token');
  }

  await storeSession(user, token, refreshToken);

  return { user, token };
};

export const logout = async () => {
  await SecureStore.deleteItemAsync('token');
  await SecureStore.deleteItemAsync('user');
  await SecureStore.deleteItemAsync("refreshToken");
  setAuthToken(null);
};

export const firebaseLogin = async (idToken: string | undefined): Promise<{ user: User; token: string }> => {
  const response = await API.post<LoginResponse>("/api/v1/firebase-auth/firebase-login", { idToken })
  const { user, token, refreshToken } = response.data;

  await storeSession(user, token, refreshToken);

  return { user, token };
}

export const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");

  if(!refreshToken) {
    console.warn("No refresh token found");
    return false;
  }

  try {
    const res = await API.post("/api/v1/auth/refresh-token", { refreshToken });

    const { token: newToken, refreshToken: newRefreshToken } = res.data;
    const userString = await SecureStore.getItemAsync("user");

    if(!userString || !newToken || !newRefreshToken) {
      throw new Error("Missing data on refresh");
    }

    const user = JSON.parse(userString);
    await storeSession(user, newToken, newRefreshToken);

    return true;
  } catch (error) {
    console.error("Refresh token failed:", error);
    await logout();
    return false;
  }
}

export const loadUserFromStorage = async () => {
  const token = await SecureStore.getItemAsync('token');
  const userString = await SecureStore.getItemAsync('user');

  if (!token || !userString) {
    return null;
  }

  const decodedToken = jwtDecode<{ exp: number }>(token);

  if (decodedToken.exp * 1000 < Date.now()) {
    const refreshed = await refreshAccessToken();
    if(!refreshed) {
      return null;
    }

    const newToken = await SecureStore.getItemAsync("token");
    const updatedUser = await SecureStore.getItemAsync("user");

    if (!newToken || !updatedUser) {
      return null;
    }

    setAuthToken(newToken);
    return JSON.parse(updatedUser);
  }

  setAuthToken(token);
  return JSON.parse(userString);
};

const storeSession = async (user: User, token: string, refreshToken: string) => {
  const decodedToken = jwtDecode<{ exp: number }>(token);

  if(decodedToken.exp * 1000 < Date.now()) {
    throw new Error("Access token is expired");
  }

  await SecureStore.setItemAsync("token", token);
  await SecureStore.setItemAsync("refreshToken", refreshToken);
  await SecureStore.setItemAsync("user", JSON.stringify(user));
  setAuthToken(token);
}