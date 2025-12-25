import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  login as loginService,
  signup as signUpService,
  loadUserFromStorage,
  firebaseLogin as firebaseLoginService,
  logout as logoutRequest
} from '../services/AuthService';
import { clearSession } from "../services/SessionService";
import { NewUser, User } from '../models/User';
import { setAuthToken } from '../services/AuthTokenManager';
import * as SecureStore from 'expo-secure-store';
import { reset } from '../navigation/RootNavigation';
import { clearAllCachedSaintDetails, clearCachedDoneToday, clearCachedHighestStreak, clearCachedJournalEntries, clearCachedRosaries, clearCachedSaintOfTheDay, clearCachedSaints, clearCachedStreak } from '../services/CacheService';
import Toast from 'react-native-root-toast';
import API, { setupInterceptors } from '../services/api';
import { setAccessToken, setRefreshToken } from '../services/TokenStorage';
import { refreshAccessToken } from '../services/TokenService';

interface AuthContextType {
  user: User | null;
  login?: (email: string, password: string) => Promise<void>;
  signup?: (user: NewUser) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  firebaseLogin: (token: string | undefined) => Promise<void>;
  setUser?: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

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
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken) {
        await logoutRequest(refreshToken);
      }
    } catch (e) {
      console.warn("Logout request failed (safe to ignore)", e);
    } finally {
      await clearCachedSaints();
      await clearAllCachedSaintDetails();
      await clearCachedRosaries();
      await clearCachedJournalEntries();
      await clearCachedDoneToday();
      await clearCachedStreak();
      await clearCachedHighestStreak();
      await clearCachedSaintOfTheDay();
  
      await clearSession();
      await setAccessToken(null);
      await setRefreshToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const storedUser = await loadUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
  
          const accessToken = await SecureStore.getItemAsync("token");
          if (accessToken) {
            setAuthToken(accessToken);
          }
        }
      } catch (err) {
        console.error("Failed to bootstrap user:", err);
      } finally {
        setupInterceptors(logout);
        setInitialized(true);
        setLoading(false);
      }
    };
  
    initAuth();
  }, []);

  const signup = async (userToCreate: NewUser) => {
    const result = await signUpService(userToCreate);
    if(!result) {
      throw new Error('Signup failed');
    }

    const { user, token } = result;
    setAuthToken(token);
    setUser(user);
  };

  const firebaseLoginInProgress = React.useRef(false);

  const firebaseLogin = async (idToken: string | undefined) => {
    if (!idToken) {
      throw new Error("Missing Firebase ID token");
    }

    if (firebaseLoginInProgress.current) {
      console.log("Skipping duplicate firebaseLogin call");
      return;
    }

    firebaseLoginInProgress.current = true;

    try {
      const result = await firebaseLoginService(idToken);
      if(!result) {
        throw new Error("Firebase login failed");
      }

      const { user, token, refreshToken } = result;
      setAuthToken(token);
      await setAccessToken(token);
      await setRefreshToken(refreshToken);
      setUser(user);
    } catch (error) {
      console.error("Firebase login error", error);
      Toast.show("Google sign-in failed. Please try again.", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
      });
      throw error;
    } finally {
      firebaseLoginInProgress.current = false;      
    }
  }

  useEffect(() => {
    if(initialized && user === null) {
      reset("Landing");
    }
  }, [user, initialized]);

  return (
    <AuthContext.Provider value={{ user, logout, firebaseLogin, loading, setUser }}>
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
