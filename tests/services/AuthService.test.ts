import { jwtDecode } from "jwt-decode";
import { User } from "../../models/User";
import API from "../../services/api";
import * as AuthService from '../../services/AuthService';
import * as SecureStore from 'expo-secure-store';


jest.mock('../../services/api');
jest.mock('expo-secure-store');
jest.mock('jwt-decode');

const mockUser: User = {
    id: '1',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'hashed',
    role: 'user',
};

const mockToken = "valid.jwt.token";

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
                data: { user: mockUser, token: mockToken},
            });
            (jwtDecode as jest.Mock).mockReturnValue(validDecodedToken);

            const result = await AuthService.login("test@example.com", "password");

            expect(SecureStore.setItemAsync).toHaveBeenCalledWith("token", mockToken);
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith("user", JSON.stringify(mockUser));
            expect(result).toEqual({ user: mockUser, token: mockToken });
        })

        it("throws if token is expired", async () => {
            (API.post as jest.Mock).mockResolvedValue({
                data: { user: mockUser, token: mockToken },
            });
            (jwtDecode as jest.Mock).mockReturnValue(expiredDecodedToken);
        
            await expect(
                AuthService.login(
                    'test@example.com',
                    "password"
                )
            ).rejects.toThrow("Token is expired!");
        })
    })

    describe("signup", () => {
        it('stores token and user, returns them if token is valid', async () => {
            (API.post as jest.Mock).mockResolvedValue({
              data: { user: mockUser, token: mockToken },
            });
            (jwtDecode as jest.Mock).mockReturnValue(validDecodedToken);
      
            const result = await AuthService.signup({
              email: 'test@example.com',
              password: 'pass',
              firstName: 'T',
              lastName: 'U',
            });
      
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('token', mockToken);
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
              'user',
              JSON.stringify(mockUser)
            );
            expect(result).toEqual({ user: mockUser, token: mockToken });
        });

        it("throws if token is expired", async () => {
            (API.post as jest.Mock).mockResolvedValue({
                data: { user: mockUser, token: mockToken },
            });
            (jwtDecode as jest.Mock).mockReturnValue(expiredDecodedToken);
        
            await expect(
                AuthService.signup({
                    email: 'test@example.com',
                    password: 'pass',
                    firstName: 'T',
                    lastName: 'U',
                })
            ).rejects.toThrow("Token is expired!");
        });

        describe("logout", () => {
            it("returns null if no token or user", async () => {
                (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
                const user = await AuthService.loadUserFromStorage();
                expect(user).toBeNull();
            })

            it("returns null and logs out if token is expired", async () => {
                (SecureStore.getItemAsync as jest.Mock)
                    .mockResolvedValueOnce(mockToken)
                    .mockResolvedValueOnce(JSON.stringify(mockUser));
                (jwtDecode as jest.Mock).mockReturnValue(expiredDecodedToken);

                const result = await AuthService.loadUserFromStorage();
                expect(result).toBeNull();
            })

            it("returns user if token is valid", async () => {
                (SecureStore.getItemAsync as jest.Mock)
                    .mockResolvedValueOnce(mockToken)
                    .mockResolvedValueOnce(JSON.stringify(mockUser));
                (jwtDecode as jest.Mock).mockReturnValue(validDecodedToken);

                const result = await AuthService.loadUserFromStorage();
                expect(result).toEqual(mockUser);
            })
        })
    })
})