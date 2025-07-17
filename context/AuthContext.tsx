import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import API, { setAuthToken } from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface AuthContextProps {
  user: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

type JwtPayload = {
  sub: string;
  exp: number;
  iat: number;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          const decodedToken = jwtDecode<JwtPayload>(token);

          if (decodedToken.exp * 1000 < Date.now()) {
            await SecureStore.deleteItemAsync('token');
            setAuthToken(null);
            setUser(null);
            return;
          }

          setAuthToken(token);
          setUser(decodedToken.sub);
        }
      } catch (err) {
        console.error('Invalid token: ', err);
        await SecureStore.deleteItemAsync('token');
        setAuthToken(null);
        setUser(null);
        return;
      }
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await API.post('auth/login', { email, password });
    const { token } = res.data;
    const decodedToken = jwtDecode<JwtPayload>(token);

    if (decodedToken.exp * 1000 < Date.now()) {
      await SecureStore.deleteItemAsync('token');
      setAuthToken(null);
      setUser(null);
      return;
    }

    await SecureStore.setItemAsync('token', token);
    setAuthToken(token);
    setUser(decodedToken.sub);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
