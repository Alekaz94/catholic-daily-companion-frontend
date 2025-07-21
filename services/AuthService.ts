import { jwtDecode } from 'jwt-decode';
import { NewUser, User } from '../models/User';
import * as SecureStore from 'expo-secure-store';
import API, { setAuthToken } from './api';
import { LoginResponse } from '../models/Login';

export const login = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  const res = await API.post<LoginResponse>('/api/v1/auth/login', { email, password });
  const { user, token } = res.data;

  if (!token || typeof token !== 'string') {
    console.error('Invalid token format');
    alert('Login failed: Invalid token received');
  }

  setAuthToken(token);
  await SecureStore.setItemAsync('token', token);
  await SecureStore.setItemAsync('user', JSON.stringify(user));
  const decodedToken = jwtDecode<{ exp: number }>(token);

  if (decodedToken.exp * 1000 < Date.now()) {
    throw new Error('Token is expired!');
  }

  return { user, token };
};

export const signup = async (userToCreate: NewUser): Promise<{user: User; token: string}> => {
  const res = await API.post('/api/v1/auth/sign-up', userToCreate);
  const { user, token } = res.data;

  const decodedToken = jwtDecode<{ exp: number }>(token);

  if (decodedToken.exp * 1000 < Date.now()) {
    throw new Error('Token is expired!');
  }

  await SecureStore.setItemAsync('token', token);
  await SecureStore.setItemAsync('user', JSON.stringify(user));
  setAuthToken(token);
  return { user, token };
};

export const logout = async () => {
  await SecureStore.deleteItemAsync('token');
  await SecureStore.deleteItemAsync('user');
  setAuthToken(null);
};

export const loadUserFromStorage = async () => {
  const token = await SecureStore.getItemAsync('token');
  const userString = await SecureStore.getItemAsync('user');

  if (!token || !userString) {
    return null;
  }

  const decodedToken = jwtDecode<{ exp: number }>(token);

  if (decodedToken.exp * 1000 < Date.now()) {
    await logout();
    return null;
  }

  setAuthToken(token);
  return JSON.parse(userString);
};