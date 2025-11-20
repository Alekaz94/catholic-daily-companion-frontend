import { jwtDecode } from "jwt-decode";
import { NewUser, User } from "../../src/models/User";
import API from "../../src/services/api";
import * as AuthService from '../../src/services/AuthService';
import * as SecureStore from 'expo-secure-store';
import { storeSession } from '../../src/services/SessionService';
import { refreshAccessToken } from '../../src/services/TokenService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('../../src/services/api');
jest.mock('expo-secure-store');
jest.mock('jwt-decode');
jest.mock('../../src/services/TokenService');
jest.mock('../../src/services/SessionService');

const mockUser: User = {
    id: '1',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'hashed',
    role: 'user',
    createdAt: "",
    updatedAt: ""
};

const mockToken = "valid.jwt.token";
const mockRefreshToken = "refresh.token";

const validDecodedToken = {
    exp: Math.floor(Date.now() / 1000) + 60,
};

const expiredDecodedToken = {
    exp: Math.floor(Date.now() / 1000) - 60,
};

describe("AuthService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("login", () => {
        it("stores token and user, returns them if token is valid", async () => {
            (API.post as jest.Mock).mockReturnValue({
                data: { user: mockUser, token: mockToken, refreshToken: mockRefreshToken },
            });
            (storeSession as jest.Mock).mockResolvedValue(undefined);

            const result = await AuthService.login("test@example.com", "password");

            expect(storeSession).toHaveBeenCalledWith(mockUser, mockToken, mockRefreshToken);
            expect(result).toEqual({ user: mockUser, token: mockToken });
        })

        it("throws if token or refresh token is missing", async () => {
            (API.post as jest.Mock).mockResolvedValue({
                data: { user: mockUser, token: null, refreshToken: null },
            });
            (jwtDecode as jest.Mock).mockReturnValue(expiredDecodedToken);
        
            await expect(AuthService.login("test@example.com", "password"))
            .rejects
            .toThrow("Login failed: Missing token or refresh token");
        })
    })

    describe("signup", () => {
        it('stores token and user, returns them if token is valid', async () => {
            const newUser: NewUser = { email: 'test@example.com', password: 'pass', firstName: 'T', lastName: 'U' };

            (API.post as jest.Mock).mockResolvedValue({
                data: { user: mockUser, token: mockToken, refreshToken: mockRefreshToken },
            });
            (storeSession as jest.Mock).mockResolvedValue(undefined);
      
            const result = await AuthService.signup(newUser);

            expect(storeSession).toHaveBeenCalledWith(mockUser, mockToken, mockRefreshToken);
            expect(result).toEqual({ user: mockUser, token: mockToken });
        });

        it("throws if token or refreshToken is missing", async () => {
            const newUser: NewUser = { email: 'test@example.com', password: 'pass', firstName: 'T', lastName: 'U' };

            (API.post as jest.Mock).mockResolvedValue({
                data: { user: mockUser, token: null, refreshToken: null },
            });
        
            await expect(AuthService.signup(newUser))
                .rejects
                .toThrow("Signup failed: Missing token or refresh token");
        });

        describe("firebaseLogin", () => {
            it("stores token and user, returns them", async () => {
                (API.post as jest.Mock).mockResolvedValue({
                    data: { user: mockUser, token: mockToken, refreshToken: mockRefreshToken },
                });

                (storeSession as jest.Mock).mockResolvedValue(undefined);

                const result = await AuthService.firebaseLogin("idTokenValue");

                expect(storeSession).toHaveBeenCalledWith(mockUser, mockToken, mockRefreshToken);
                expect(result).toEqual({ user: mockUser, token: mockToken })
            });
        });

        describe("loadUserFromStorage", () => {
            it("returns null if no token or user", async () => {
                (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
                const user = await AuthService.loadUserFromStorage();
                expect(user).toBeNull();
            })

            it("refreshes expired token and returns updated user", async () => {
                (SecureStore.getItemAsync as jest.Mock)
                    .mockResolvedValueOnce(mockToken)
                    .mockResolvedValueOnce(JSON.stringify(mockUser))
                    .mockResolvedValueOnce("new token")
                    .mockResolvedValueOnce(JSON.stringify(mockUser));

                (jwtDecode as jest.Mock).mockReturnValue(expiredDecodedToken);
                (refreshAccessToken as jest.Mock).mockResolvedValue(true);

                const user = await AuthService.loadUserFromStorage();

                expect(user).toEqual(mockUser);
            });

            it("returns null if token expired and refreshAccessToken fails", async () => {
                (SecureStore.getItemAsync as jest.Mock)
                    .mockResolvedValueOnce(mockToken)
                    .mockResolvedValueOnce(JSON.stringify(mockUser));

                (jwtDecode as jest.Mock).mockReturnValue(expiredDecodedToken);
                (refreshAccessToken as jest.Mock).mockResolvedValue(false);

                const user = await AuthService.loadUserFromStorage();
                expect(user).toBeNull();
            });

            it("returns null if refreshed token or user missing ", async () => {
                (SecureStore.getItemAsync as jest.Mock)
                    .mockResolvedValueOnce(mockToken)
                    .mockResolvedValueOnce(JSON.stringify(mockUser))
                    .mockResolvedValueOnce(null)
                    .mockResolvedValueOnce(null);

                    (jwtDecode as jest.Mock).mockReturnValue(expiredDecodedToken);
                    (refreshAccessToken as jest.Mock).mockResolvedValue(true);

                    const user = await AuthService.loadUserFromStorage();
                    expect(user).toBeNull();
            });

            it("returns user if token is valid", async () => {
                (SecureStore.getItemAsync as jest.Mock)
                    .mockImplementation((key: string) => {
                        if (key === 'token') return Promise.resolve(mockToken);
                        if (key === 'user') return Promise.resolve(JSON.stringify(mockUser));
                        return Promise.resolve(null);
                        });
                (jwtDecode as jest.Mock).mockReturnValue(validDecodedToken);
                
                const user = await AuthService.loadUserFromStorage();
                expect(user).toEqual(mockUser);
            });
        });
    })
})