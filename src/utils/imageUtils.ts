import Constants from "expo-constants";

export const buildImageUri = (url: string | null): string | undefined => {
    if(!url) {
        return undefined;
    }

    if(url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    const baseUrl = Constants.expoConfig?.extra?.API_BASE_URL;
    return `${baseUrl}${url}`;
}