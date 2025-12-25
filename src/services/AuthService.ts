import { NewUser, User } from "../models/User";
import * as SecureStore from 'expo-secure-store';
import { API } from './HttpClients';
import { setAuthToken } from './AuthTokenManager';
import { LoginResponse } from '../models/Login';
import { storeSession } from './SessionService';

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

export const firebaseLogin = async (idToken: string | undefined): Promise<{ user: User; token: string, refreshToken: string }> => {
  if (!idToken) {
    throw new Error("Firebase ID token missing");
  }

  const response = await API.post<LoginResponse>("/api/v1/firebase-auth/firebase-login", { idToken });
  const { user, token, refreshToken } = response.data;

  await storeSession(user, token, refreshToken);

  return { user, token, refreshToken };
}

export const logout = async (refreshToken: string) => {
  if(!refreshToken) {
    return
  }

  await API.post("/api/v1/auth/logout", { refreshToken});
}

export const loadUserFromStorage = async () => {
  const userString = await SecureStore.getItemAsync('user');
  const accessToken = await SecureStore.getItemAsync('token');

  if (!userString) return null;

  if (accessToken) setAuthToken(accessToken);

  return JSON.parse(userString);
};