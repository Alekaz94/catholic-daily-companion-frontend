import * as SessionService from '../../src/services/SessionService';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken } from '../../src/services/AuthTokenManager';
import { User } from '../../src/models/User';
import { jwtDecode } from "jwt-decode";

jest.mock('expo-secure-store');
jest.mock('../../src/services/AuthTokenManager');
jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn(),
}));

const mockUser: User = {
    id: "1",
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "hashed",
    role: "user",
    createdAt: "",
    updatedAt: ""
};

describe("SessionService", () => {
    beforeEach(() => jest.clearAllMocks());

    it("stores session with valid token", async () => {
        const futureToken = "valid.jwt.token";
        const expMock = Math.floor(Date.now() / 1000) + 60; // token not expired

        (jwtDecode as jest.Mock).mockReturnValue({ exp: expMock });

        await SessionService.storeSession(mockUser, futureToken, "refreshToken");

        expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(3);
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith("token", futureToken);
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith("refreshToken", "refreshToken");
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith("user", JSON.stringify(mockUser));
        expect(setAuthToken).toHaveBeenCalledWith(futureToken);
    });

    it("warns if storing an expired token", async () => {
        const expiredToken = "expired.jwt.token";
        const expMock = Math.floor(Date.now() / 1000) - 60; // token expired

        (jwtDecode as jest.Mock).mockReturnValue({ exp: expMock });
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        await SessionService.storeSession(mockUser, expiredToken, "refreshToken");

        expect(consoleWarnSpy).toHaveBeenCalledWith("Warning: Storing an already expired token!");
        expect(setAuthToken).toHaveBeenCalledWith(expiredToken);

        consoleWarnSpy.mockRestore();
    });

    it("clears session correctly", async () => {
        await SessionService.clearSession();

        expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(3);
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("token");
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("user");
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("refreshToken");
        expect(setAuthToken).toHaveBeenCalledWith(null);
    });
});
