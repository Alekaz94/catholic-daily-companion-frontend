import * as SecureStore from 'expo-secure-store';
import { getAuthToken, setAuthToken, getAuthHeader } from '../../src/services/AuthTokenManager';

jest.mock('expo-secure-store');  

describe("AuthTokenManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setAuthToken(null);
  });

  it("should set and get the in-memory token", () => {
    setAuthToken("abc123");
    expect(getAuthToken()).toBe("abc123");
  });

  it("getAuthHeader returns Authorization header if in-memory token exists", async () => {
    setAuthToken("token123");
    const header = await getAuthHeader();
    expect(header).toEqual({ Authorization: "Bearer token123" });
  });

  it("getAuthHeader fetches token from SecureStore if in-memory token is null", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("secureToken");
    const header = await getAuthHeader();
    expect(header).toEqual({ Authorization: "Bearer secureToken" });
    expect(getAuthToken()).toBe("secureToken");
  });

  it("getAuthHeader returns empty object if no token in memory or SecureStore", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    const header = await getAuthHeader();
    expect(header).toEqual({});
  });

  it("handles SecureStore errors gracefully", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error("Store error"));
    const header = await getAuthHeader();
    expect(header).toEqual({});
  });
});
