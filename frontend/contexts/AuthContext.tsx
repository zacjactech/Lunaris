'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';

interface User {
  id: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    // Try to restore access token from sessionStorage
    const storedToken = sessionStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/api/auth/refresh');
      const token = response.data.accessToken;
      setAccessToken(token);
      setUser(response.data.user);
      sessionStorage.setItem('accessToken', token);
    } catch (error) {
      // Clear auth state if refresh fails
      setAccessToken(null);
      setUser(null);
      sessionStorage.removeItem('accessToken');
      throw error;
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axiosInstance.post('/api/auth/login', { email, password });
    const token = response.data.accessToken;
    setAccessToken(token);
    setUser(response.data.user);
    sessionStorage.setItem('accessToken', token);
    router.push('/');
  };

  const register = async (email: string, password: string, displayName?: string) => {
    const response = await axiosInstance.post('/api/auth/register', {
      email,
      password,
      displayName,
    });
    const token = response.data.accessToken;
    setAccessToken(token);
    setUser(response.data.user);
    sessionStorage.setItem('accessToken', token);
    router.push('/');
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
      sessionStorage.removeItem('accessToken');
      router.push('/auth');
    }
  };

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  useEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Don't retry if it's the refresh endpoint itself
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/api/auth/refresh')) {
          originalRequest._retry = true;

          try {
            await refreshToken();
            return axiosInstance(originalRequest);
          } catch {
            setUser(null);
            setAccessToken(null);
            if (isMounted) {
              router.push('/auth');
            }
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [router, refreshToken, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const initAuth = async () => {
      try {
        const response = await axiosInstance.post('/api/auth/refresh');
        const token = response.data.accessToken;
        setAccessToken(token);
        setUser(response.data.user);
        sessionStorage.setItem('accessToken', token);
      } catch {
        console.log('No valid session');
        sessionStorage.removeItem('accessToken');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
     
  }, [isMounted]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
