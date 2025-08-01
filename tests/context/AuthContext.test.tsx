import React from "react";
import { render, waitFor, act } from "@testing-library/react-native";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import {
  login as loginService,
  logout as logoutService,
  signup as signUpService,
  loadUserFromStorage,
} from "../../services/AuthService";
import { Text } from 'react-native';
import { NewUser, User } from "../../models/User";

jest.mock("../../services/AuthService")

const mockUser: User = {
    id: "123",
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "hashedPassword",
    role: "user"
}

const mockNewUser: NewUser = {
    firstName: "Test2",
    lastName: "User2",
    email: "test2@example.com",
    password: "hashedPassword2"
}

const mockToken = "mockToken123";

const TestComponent = () => {
    const { user, login, signup, logout } = useAuth();
  
    return (
      <>
        <Text testID="user-email">{user ? user.email : "no-user"}</Text>
  
        <Text testID="login" onPress={() => login("test@example.com", "password")}>
          Login
        </Text>
  
        <Text testID="signup" onPress={() => signup(mockNewUser)}>
          Signup
        </Text>
  
        <Text testID="user-name">
          {user ? `${user.firstName} ${user.lastName}` : "no-user"}
        </Text>
  
        <Text testID="logout" onPress={logout}>
          Logout
        </Text>
      </>
    );
};

  describe("AuthContext", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("loads user from storage on mount", async () => {
        (loadUserFromStorage as jest.Mock).mockResolvedValue(mockUser);
        
        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => {
            expect(getByTestId("user-email").props.children).toBe(mockUser.email);
        });
    });

    it("logs in and sets the user", async () => {
        (loginService as jest.Mock).mockResolvedValue({ user: mockUser, token: mockToken });
        
        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await act(async () => {
            getByTestId("login").props.onPress();
        });
        expect(getByTestId("user-email").props.children).toBe(mockUser.email);
        expect(loginService).toHaveBeenCalledWith("test@example.com", "password");
    });

    it("signs up and sets the user", async () => {
        (signUpService as jest.Mock).mockResolvedValue({ user: mockNewUser, token: mockToken });
        
        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await act(async () => {
            getByTestId("signup").props.onPress();
        })
        expect(getByTestId("user-email").props.children).toBe(mockNewUser.email);
        expect(signUpService).toHaveBeenCalledWith(mockNewUser);
    })

    it("logs out and clears the user", async () => {
        (loadUserFromStorage as jest.Mock).mockResolvedValue(mockUser);
        (logoutService as jest.Mock).mockResolvedValue(undefined);

        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(getByTestId("user-email").props.children).toBe(mockUser.email);
        });

        await act(async () => {
            getByTestId("logout").props.onPress();
        });
        expect(getByTestId("user-email").props.children).toBe("no-user");
        expect(logoutService).toHaveBeenCalled();
    });

    it("throws error if useAuth is used outside AuthProvider", () => {
        const renderOutsideProvider = () => {
            render(<TestComponent />)
        };
        expect(renderOutsideProvider).toThrow("useAuth must be used inside AuthProvider");
    });
  })