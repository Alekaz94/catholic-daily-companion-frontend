import { jwtDecode } from 'jwt-decode';
import { NewUser, User } from "../models/User";
import * as SecureStore from 'expo-secure-store';
import API from './api';
import { setAuthToken } from './AuthTokenManager';
import { LoginResponse } from '../models/Login';
import { refreshAccessToken } from './TokenService';
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

export const firebaseLogin = async (idToken: string | undefined): Promise<{ user: User; token: string }> => {
  const response = await API.post<LoginResponse>("/api/v1/firebase-auth/firebase-login", { idToken })
  const { user, token, refreshToken } = response.data;

  await storeSession(user, token, refreshToken);

  return { user, token };
}

export const loadUserFromStorage = async () => {
  const EXPIRY_BUFFER = 60 * 1000;
  const token = await SecureStore.getItemAsync('token');
  const userString = await SecureStore.getItemAsync('user');

  if (!token || !userString) {
    return null;
  }

  const decodedToken = jwtDecode<{ exp: number }>(token);

  if (decodedToken.exp * 1000 < Date.now() + EXPIRY_BUFFER) {
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