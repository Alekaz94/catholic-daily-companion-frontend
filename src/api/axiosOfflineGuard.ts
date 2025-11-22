import { AxiosInstance } from "axios";
import NetInfo from "@react-native-community/netinfo";
import { ToastAndroid } from "react-native";

export const applyOfflineInterceptor = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.request.use(async (config) => {
        const state = await NetInfo.fetch();
    
        if (!state.isConnected) {
            const error: any = new Error('No Internet Connection');
            error.isOffline = true;
            ToastAndroid.show("You're offline!", ToastAndroid.SHORT);
            return Promise.reject(error);
          }
    
        return config;
      });
}