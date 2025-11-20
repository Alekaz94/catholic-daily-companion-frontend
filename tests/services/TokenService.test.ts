import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { refreshAccessToken } from '../../src/services/TokenService';
import * as SessionService from '../../src/services/SessionService';

jest.mock('axios');
jest.mock('expo-secure-store');
jest.mock('../../src/services/SessionService');

describe("TokenService - refreshAccessToken", () => {
    const mockUser = { id: "1", email: "test@example.com" };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns false if no refresh token found", async () => {
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

        const result = await refreshAccessToken();
        expect(result).toBe(false);
    });

    it("successfully refreshes token and stores session", async () => {
        (SecureStore.getItemAsync as jest.Mock)
            .mockResolvedValueOnce("oldRefreshToken") // refreshToken
            .mockResolvedValueOnce(JSON.stringify(mockUser)); // user

        (axios.create as jest.Mock).mockReturnValue({
            post: jest.fn().mockResolvedValue({
                data: { token: "newToken", refreshToken: "newRefreshToken" }
            })
        });

        const result = await refreshAccessToken();
        expect(result).toBe(true);
        expect(SessionService.storeSession).toHaveBeenCalledWith(mockUser, "newToken", "newRefreshToken");
    });

    it("returns false and clears session on API error", async () => {
        (SecureStore.getItemAsync as jest.Mock)
            .mockResolvedValueOnce("oldRefreshToken")
            .mockResolvedValueOnce(JSON.stringify(mockUser));

        const axiosInstance = { post: jest.fn().mockRejectedValue(new Error("Network error")) };
        (axios.create as jest.Mock).mockReturnValue(axiosInstance);

        const result = await refreshAccessToken();
        expect(result).toBe(false);
        expect(SessionService.clearSession).toHaveBeenCalled();
    });

    it("returns false if missing user, token, or refresh token", async () => {
        (SecureStore.getItemAsync as jest.Mock)
            .mockResolvedValueOnce("oldRefreshToken")
            .mockResolvedValueOnce(null); // user missing

        (axios.create as jest.Mock).mockReturnValue({
            post: jest.fn().mockResolvedValue({
                data: { token: "newToken", refreshToken: "newRefreshToken" }
            })
        });

        const result = await refreshAccessToken();
        expect(result).toBe(false);
        expect(SessionService.clearSession).toHaveBeenCalled();
    });
});
