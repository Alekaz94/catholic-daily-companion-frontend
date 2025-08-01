import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  login as loginService,
  logout as logoutService,
  signup as signUpService,
  loadUserFromStorage,
} from '../services/AuthService';
import { NewUser, User } from '../models/User';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (user: NewUser) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const result = await loginService(email, password);
    if (!result) {
      throw new Error('Login failed: no response from login service');
    }
    const { user, token } = result;
    setUser(user);
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  const bootstrapUser = async () => {
    const user = await loadUserFromStorage();
    setUser(user);
  };

  const signup = async (userToCreate: NewUser) => {
    const { user, token } = await signUpService(userToCreate);
    setUser(user);
  };

  useEffect(() => {
    bootstrapUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
