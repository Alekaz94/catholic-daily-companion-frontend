import * as SecureStore from 'expo-secure-store';

let currentToken: string | null = null;

/** Sets the in-memory token (used for headers) */
export const setAuthToken = (token: string | null) => {
    currentToken = token;
};

/** Returns the in-memory token (fast lookup) */
export const getAuthToken = () => currentToken;

/**
 * Returns the Authorization header object.
 * Checks in-memory first, then SecureStore.
 */
export const getAuthHeader = async (): Promise<Record<string, string>> => {
    if(!currentToken) {
        try {
            const token = await SecureStore.getItemAsync("token");
            if (token) {
                currentToken = token;
            }
        } catch (error) {
            console.error("Failed to read token from SecureStore:", error);
        }
    }

    return currentToken ? { Authorization: `Bearer ${currentToken}` } : {};
}