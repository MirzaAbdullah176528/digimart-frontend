'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

interface User {
  sub: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (credentials: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => string | null;
  setToken: (token: string | null) => void;
}

function decodeToken(token: string): User | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      window.atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    const { sub, email } = JSON.parse(json);
    return { sub, email };
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenRef = useRef<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleExpired = () => {
      tokenRef.current = null;
      setAccessToken(null);
      setUser(null);
      router.push('/login');
    };

    window.addEventListener('session:expired', handleExpired);
    return () => window.removeEventListener('session:expired', handleExpired);
  }, [router]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          const token: string = data.accessToken;
          tokenRef.current = token;
          setAccessToken(token);
          setUser(decodeToken(token));
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const getToken = useCallback(() => tokenRef.current, []);

  const setToken = useCallback((token: string | null) => {
    tokenRef.current = token;
    setAccessToken(token);
    setUser(token ? decodeToken(token) : null);
  }, []);

  const login = useCallback(async (credentials: {
    username: string;
    email: string;
    password: string;
  }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    const token: string = data.accessToken;
    tokenRef.current = token;
    setAccessToken(token);
    setUser(decodeToken(token));
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      tokenRef.current = null;
      setAccessToken(null);
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout, getToken, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}