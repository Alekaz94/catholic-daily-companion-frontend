import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { clearSession, storeSession } from './SessionService';

export const refreshAccessToken = async (instance?: AxiosInstance): Promise<boolean> => {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
  
    if(!refreshToken) {
      console.warn("No refresh token found");
      return false;
    }
  
    try {
        const axiosInstance = instance || axios.create();
        const res = await axiosInstance.post("/api/v1/auth/refresh-token", { refreshToken });
    
        const { token: newToken, refreshToken: newRefreshToken } = res.data;
        const userString = await SecureStore.getItemAsync("user");
    
        if(!userString || !newToken || !newRefreshToken) {
            throw new Error("Missing data on refresh");
        }
    
        const user = JSON.parse(userString);
        await storeSession(user, newToken, newRefreshToken);
    
        return true;
    } catch (error: any) {
        if(error.response) {
            console.error("Refresh token failed:", error.response.status, error.response.data);
        } else {
            console.error("Refresh error:", error.message);
        }
        await clearSession();
        return false;
    }
  }