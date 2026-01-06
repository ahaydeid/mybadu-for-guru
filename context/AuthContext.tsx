'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface User {
  id: number;
  name: string;
  username: string;
  email?: string;
  roles: string[];
  guru?: any;
  can_edit_profile?: boolean | number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  syncProfile: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token dari localStorage saat mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setToken(savedToken);
      setUser(parsedUser);
      // Sinkronisasi data terbaru di background
      syncProfile(savedToken);
    }
    setIsLoading(false);
  }, []);

  const syncProfile = async (customToken?: string) => {
    const activeToken = customToken || token;
    if (!activeToken) return;

    try {
      const result = await api.getProfile(activeToken);
      if (result.success) {
        // Handle potentially nested user object from API
        let userData = result.data.user || result.data;

        // Try to capture can_edit_profile if it's a sibling in result.data
        if (result.data?.can_edit_profile !== undefined) {
           userData = { ...userData, can_edit_profile: result.data.can_edit_profile };
        }

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Failed to sync profile:", error);
    }
  };

  const login = async (username: string, password: string) => {
    const result = await api.login(username, password);
    
    if (result.success) {
      setToken(result.data.token);
      setUser(result.data.user);
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    } else {
      throw new Error(result.message);
    }
  };

  const logout = async () => {
    if (token) {
      await api.logout(token);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, syncProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
