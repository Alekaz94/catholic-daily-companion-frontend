import { Saint } from "../models/Saint";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAINT_CACHE_KEY = "cached_saints";

export const cacheSaints = async (saints: Saint[]) => {
    try {
        await AsyncStorage.setItem(SAINT_CACHE_KEY, JSON.stringify(saints));
    } catch (error) {
        console.error("Failed to cache saints", error)
    }
};

export const getCachedSaints = async (): Promise<Saint[] | null> => {
    try {
        const data = await AsyncStorage.getItem(SAINT_CACHE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Failed to load cached saints", error);
        return null;
    }
}

export const clearCachedSaints = async () => {
    try {
        await AsyncStorage.removeItem(SAINT_CACHE_KEY);
    } catch (error) {
        console.error("Failed to clear saint cache", error);
    }
}