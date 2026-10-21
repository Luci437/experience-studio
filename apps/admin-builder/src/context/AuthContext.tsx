import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser } from '@repo/types';
import { login as loginApi } from '@repo/api-client';

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser);
        return { ...parsed, token };
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({ ...parsed, token });
      } catch {
        setUser(null);
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    const response = await loginApi({ username, password });
    const authUser: AuthUser = {
      userId: response.userId,
      username: response.username,
      role: response.role,
      token: response.token,
    };
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify({
      userId: response.userId,
      username: response.username,
      role: response.role,
    }));
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin: user?.role === 'ADMIN',
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
