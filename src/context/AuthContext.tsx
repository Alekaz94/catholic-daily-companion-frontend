import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  login as loginService,
  logout as logoutService,
  signup as signUpService,
  loadUserFromStorage,
  firebaseLogin as firebaseLoginService,
} from '../services/AuthService';
import { NewUser, User } from '../models/User';
import { setAuthToken } from '../services/api';
import * as SecureStore from 'expo-secure-store';
import { reset } from '../navigation/RootNavigation';
import { clearCachedSaints } from '../services/CacheService';
import Toast from 'react-native-root-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (user: NewUser) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  firebaseLogin: (token: string | undefined) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(user === null) {
      reset("Landing");
    }
  }, [user])

  const login = async (email: string, password: string) => {
    const result = await loginService(email, password);
    if (!result) {
      throw new Error('Login failed: no response from login service');
    }
    const { user, token } = result;
    setAuthToken(token);
    setUser(user);
  };

  const logout = async () => {
    await logoutService();
    await clearCachedSaints();
    setUser(null);
    setAuthToken(null);
  };

  const bootstrapUser = async () => {
    setLoading(true);
    try {
      const storedUser = await loadUserFromStorage();

      if(storedUser) {
        setUser(storedUser);
        const token = await SecureStore.getItemAsync('token');
        if(token) {
          setAuthToken(token);
        }
      } else {
        const existingRefreshToken = await SecureStore.getItemAsync("refreshToken");
        if(existingRefreshToken) {
          Toast.show("Session expired! Please log in again.", {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userToCreate: NewUser) => {
    const result = await signUpService(userToCreate);
    if(!result) {
      throw new Error('Signup failed');
    }

    const { user, token } = result;
    setAuthToken(token);
    setUser(user);
  };

  const firebaseLogin = async (idToken: string | undefined) => {
    const result = await firebaseLoginService(idToken);
    if(!result) {
      throw new Error("Firebase login failed");
    }

    const { user, token } = result;
    setAuthToken(token);
    setUser(user);
  }

  useEffect(() => {
    bootstrapUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, firebaseLogin, loading }}>
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
