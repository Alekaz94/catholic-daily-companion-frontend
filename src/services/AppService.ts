import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./api"
import * as Application from 'expo-application';
import semver from "semver"

const endpoint = "/api/v1/app"

export type VersionCheckResult = { type: "ok" } | { type: "soft-update"; latestVersion: string; storeUrl: string } | { type: "force-update"; storeUrl: string };

type CachedVersionCheck = {
    latestVersion: string;
    minimumSupportedVersion: string;
    storeUrl: string;
    checkedAt: number;
};

const VERSION_CACHE_KEY = "app_version_cache";
const VERSION_CACHE_TTL = 1000 * 60 * 60 * 24;
  
export const checkAppVersion = async (): Promise<VersionCheckResult> => {
    const rawVersion = Application.nativeApplicationVersion;

    if (!rawVersion) {
        return { type: "ok" };
    }
  
    const currentVersion = normalize(rawVersion);

    try {
        const cached = await AsyncStorage.getItem(VERSION_CACHE_KEY);

        if(cached) {
            const parsed = JSON.parse(cached) as CachedVersionCheck;
            const isFresh = Date.now() - parsed.checkedAt < VERSION_CACHE_TTL;

            if(isFresh) {
                return evaluateVersion(currentVersion, parsed);
            }
        }

        const response = await API.get(`${endpoint}/version`);
        const data = response.data;
        
        if(semver.lt(currentVersion, normalize(data.minimumSupportedVersion))) {
            return {
                type: "force-update",
                storeUrl: data.storeUrl,
            };
        }

        await AsyncStorage.setItem(
            VERSION_CACHE_KEY,
            JSON.stringify({
              ...data,
              checkedAt: Date.now(),
            })
        );

        return evaluateVersion(currentVersion, data);
    } catch (error) {
        const cached = await AsyncStorage.getItem(VERSION_CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached) as CachedVersionCheck;
            if (parsed.checkedAt) {
                return evaluateVersion(currentVersion, parsed);
            }
        }
        return { type: "ok" };
    }    
}

const evaluateVersion = (
    currentVersion: string, 
    data: {
        latestVersion: string;
        minimumSupportedVersion: string;
        storeUrl: string;
    }
): VersionCheckResult => {
    const latest = normalize(data.latestVersion);
    const minimum = normalize(data.minimumSupportedVersion);
    
    console.log("[VersionCheck]", {
        app: currentVersion,
        minimum,
        latest,
    });

    if (semver.lt(currentVersion, minimum)) {
        return {
          type: "force-update",
          storeUrl: data.storeUrl,
        };
      }
    
      if (semver.lt(currentVersion, latest)) {
        return { type: "soft-update", latestVersion: latest, storeUrl: data.storeUrl };
      }
    
      return { type: "ok" };
}

const normalize = (v: string) => semver.coerce(v)?.version ?? v;
