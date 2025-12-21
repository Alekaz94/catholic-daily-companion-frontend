import { Saint, SaintListDto } from "../models/Saint";
import { Rosary } from "../models/Rosary";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
import { JournalEntryLite } from "../models/JournalEntry";

const SAINT_CACHE_KEY = "cached_saints";
const ROSARY_CACHE_KEY = "rosary_history";
const ROSARY_STREAK_KEY = "rosary_streak";
const ROSARY_DONE_KEY = "rosary_done_today";
const HIGHEST_STREAK_KEY = "rosary_highest_streak";
const JOURNAL_CACHE_KEY = "cached_journal_entries";
const SAINT_OF_THE_DAY_KEY= "saint_of_the_day";
const SAINT_CACHE_KEY_PREFIX = "saint_";

export const clearAllCache = async () => {
    await clearCachedSaints();
    await clearAllCachedSaintDetails();
    await clearCachedRosaries();
    await clearCachedJournalEntries();
    await clearCachedDoneToday();
    await clearCachedStreak();
    await clearCachedHighestStreak();
    await clearCachedSaintOfTheDay();
}

export const cacheSaintOfTheDay = async (saints: SaintListDto[]) => {
    try {
        await AsyncStorage.setItem(SAINT_OF_THE_DAY_KEY, JSON.stringify({
            date: new Date().toDateString(),
            data: saints
        }));
    } catch (error) {
        console.error("Failed to cache Saint of the Day", error);
    }
}

export const getCachedSaintOfTheDay = async (): Promise<SaintListDto[] | null> => {
    try {
        const data = await AsyncStorage.getItem(SAINT_OF_THE_DAY_KEY);
        if (!data) return null;

        const parsed = JSON.parse(data);
        if (parsed.date !== new Date().toDateString()) return null; // only use today’s cache
        return parsed.data;
    } catch (error) {
        console.error("Failed to get cached Saint of the Day", error);
        return null;
    }
};

export const clearCachedSaintOfTheDay = async () => {
    try {
        await AsyncStorage.removeItem(SAINT_OF_THE_DAY_KEY);
    } catch (error) {
        console.error("Failed to clear Saint of the Day cache", error);
    }
};

export const clearAllCachedSaintDetails = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const saintKeys = keys.filter(key =>
            key.startsWith(SAINT_CACHE_KEY_PREFIX)
        );

        if (saintKeys.length > 0) {
            await AsyncStorage.multiRemove(saintKeys);
        }
    } catch (error) {
        console.error("Failed to clear all cached saint details", error);
    }
};

export const cacheSaint = async (saint: Saint) => {
    try {
        await AsyncStorage.setItem(`${SAINT_CACHE_KEY_PREFIX}${saint.id}`, JSON.stringify(saint));
    } catch (error) {
        console.error("Failed to cache individual saint", error);
    }
};

export const getCachedSaint = async (id: string): Promise<Saint | null> => {
    try {
        const data = await AsyncStorage.getItem(`${SAINT_CACHE_KEY_PREFIX}${id}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Failed to get cached individual saint", error);
        return null;
    }
};

export const clearCachedSaint = async (id: string) => {
    try {
        await AsyncStorage.removeItem(`${SAINT_CACHE_KEY_PREFIX}${id}`);
    } catch (error) {
        console.error("Failed to clear cached individual saint", error);
    }
};

export const cacheSaints = async (saints: SaintListDto[]) => {
    try {
        await AsyncStorage.setItem(SAINT_CACHE_KEY, JSON.stringify(saints));
    } catch (error) {
        console.error("Failed to cache saints", error)
    }
};

export const getCachedSaints = async (): Promise<SaintListDto[] | null> => {
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

export const cacheRosaries = async (logs: Rosary[]) => {
    try {
        await AsyncStorage.setItem(ROSARY_CACHE_KEY, JSON.stringify(logs));
    } catch (error) {
        console.error("Failed to cache rosaries", error);
    }
}

export const getCachedRosaries = async (): Promise<Rosary[] | null> => {
    try {
        const data = await AsyncStorage.getItem(ROSARY_CACHE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Failed to load rosary history", error);
        return null;
    }
}

export const cacheRosaryStreak = async (streak: number) => {
    try {
        await AsyncStorage.setItem(ROSARY_STREAK_KEY, streak.toString());
    } catch (error) {
        console.error("Failed to cache streak", error)
    }
}
  
export const getCachedStreak = async (): Promise<number | null> => {
    try {
        const data = await AsyncStorage.getItem(ROSARY_STREAK_KEY);
        return data ? parseInt(data, 10) : null;
    } catch (error) {
        console.error("Failed to load rosary streak", error);
        return null;
    }
}

export const cacheHighestStreak = async (streak: number) => {
    try {
        await AsyncStorage.setItem(HIGHEST_STREAK_KEY, streak.toString());
    } catch (error) {
        console.error("Failed to cache highest streak", error);
    }
}

export const getCachedHighestStreak = async (): Promise<number | null> => {
    try {
        const data = await AsyncStorage.getItem(HIGHEST_STREAK_KEY);
        return data ? parseInt(data, 10) : null;
    } catch (error) {
        console.error("Failed to load cached highest streak", error);
        return null;
    }
}

export const cacheDoneToday = async (done: boolean) => {
    try {
        await AsyncStorage.setItem(ROSARY_DONE_KEY, JSON.stringify(done));
    } catch (error) {
        console.error("Failed to cache done today", error);
    }
}
  
export const getCachedDoneToday = async (): Promise<boolean | null> => {
    try {
        const data = await AsyncStorage.getItem(ROSARY_DONE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Failed to load done today", error);
        return null;
    }
}

export const clearCachedHighestStreak = async () => {
    try {
        await AsyncStorage.removeItem(HIGHEST_STREAK_KEY);
    } catch (error) {
        console.error("Failed to clear cached highest streak", error);
    }
}

export const clearCachedRosaries = async () => {
    try {
        await AsyncStorage.removeItem(ROSARY_CACHE_KEY);
    } catch (error) {
        console.error("Failed to clear rosary cache", error);
    }
}

export const clearCachedStreak = async () => {
    try {
        await AsyncStorage.removeItem(ROSARY_STREAK_KEY);
    } catch (error) {
        console.error("Failed to clear rosary streak", error);
    }
}

export const clearCachedDoneToday = async () => {
    try {
        await AsyncStorage.removeItem(ROSARY_DONE_KEY);
    } catch (error) {
        console.error("Failed to clear rosary done today", error);
    }
}

export const cacheJournalEntries = async (entries: JournalEntryLite[]) => {
    try {
        await SecureStore.setItemAsync(JOURNAL_CACHE_KEY, JSON.stringify(entries));
    } catch (error) {
        console.error("Failed to cache journal entries", error);
    }
}

export const getCachedEntries = async (): Promise<JournalEntryLite[] | null> => {
    try {
        const data = await SecureStore.getItemAsync(JOURNAL_CACHE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Failed to load cached journal entries", error);
        return null;
    }
}

export const clearCachedJournalEntries = async () => {
    try {
        await SecureStore.deleteItemAsync(JOURNAL_CACHE_KEY);
    } catch (error) {
        console.error("Failed to clear journal entries cache", error);
    }
}