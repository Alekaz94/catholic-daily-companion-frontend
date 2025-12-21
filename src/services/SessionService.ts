import * as SecureStore from 'expo-secure-store';
import { setAuthToken } from "./AuthTokenManager";
import { jwtDecode } from 'jwt-decode';
import { User } from '../models/User';

export const clearSession = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    await SecureStore.deleteItemAsync("refreshToken");
    setAuthToken(null);
}

export const storeSession = async (user: User, token: string, refreshToken: string) => {
    const decodedToken = jwtDecode<{ exp: number }>(token);
  
    if(decodedToken.exp * 1000 < Date.now()) {
      console.warn("Warning: Storing an already expired token!");
    }
  
    await Promise.all([
      SecureStore.setItemAsync("token", token),
      SecureStore.setItemAsync("refreshToken", refreshToken),
      SecureStore.setItemAsync("user", JSON.stringify(user))
    ]);
    setAuthToken(token);
}