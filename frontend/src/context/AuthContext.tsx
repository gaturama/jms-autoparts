import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '../types/user.types';
import { authService } from '../service/authService';
import { storage, STORAGE_KEYS } from '../utils/storage';

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const [savedToken, savedUser] = await Promise.all([
        storage.get<string>(STORAGE_KEYS.TOKEN),
        storage.get<User>(STORAGE_KEYS.USER),
      ]);
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
      }
      setIsLoading(false);
    };
    restore();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    await Promise.all([
      storage.set(STORAGE_KEYS.TOKEN, result.token),
      storage.set(STORAGE_KEYS.USER, result.user),
    ]);
    setToken(result.token);
    setUser(result.user);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, phone?: string) => {
      const result = await authService.register({ name, email, password, phone });
      await Promise.all([
        storage.set(STORAGE_KEYS.TOKEN, result.token),
        storage.set(STORAGE_KEYS.USER, result.user),
      ]);
      setToken(result.token);
      setUser(result.user);
    },
    []
  );

  const logout = useCallback(async () => {
    await Promise.all([
      storage.remove(STORAGE_KEYS.TOKEN),
      storage.remove(STORAGE_KEYS.USER),
      storage.remove(STORAGE_KEYS.CART),
    ]);
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updated: User) => {
    setUser(updated);
    storage.set(STORAGE_KEYS.USER, updated);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};