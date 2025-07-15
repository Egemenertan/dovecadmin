'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Hardcoded güvenli şifre - üretim ortamında environment variable kullanılabilir
const ADMIN_PASSWORD = 'MV9CSJQezkvTUqA';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sayfa yüklendiğinde session kontrolü yap
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = sessionStorage.getItem('dovec_admin_auth');
        const authTimestamp = sessionStorage.getItem('dovec_admin_auth_time');
        
        if (authData && authTimestamp) {
          const timestamp = parseInt(authTimestamp);
          const now = Date.now();
          
          // 8 saat boyunca session geçerli
          const EIGHT_HOURS = 8 * 60 * 60 * 1000;
          
          if (now - timestamp < EIGHT_HOURS && authData === 'authenticated') {
            setIsAuthenticated(true);
          } else {
            // Session süresi dolmuş, temizle
            sessionStorage.removeItem('dovec_admin_auth');
            sessionStorage.removeItem('dovec_admin_auth_time');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuth();
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      // Güvenlik için password hash karşılaştırması yapılabilir
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('dovec_admin_auth', 'authenticated');
        sessionStorage.setItem('dovec_admin_auth_time', Date.now().toString());
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      sessionStorage.removeItem('dovec_admin_auth');
      sessionStorage.removeItem('dovec_admin_auth_time');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
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