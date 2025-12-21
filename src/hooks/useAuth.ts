/**
 * @file Hook para manejar la autenticación
 * @module hooks/useAuth
 */

import { useState, useEffect } from 'react';
import { AuthUser, LoginCredentials, RegisterData } from '../types';
import * as api from '../services/apiService';

/**
 * Hook para manejar el estado y operaciones de autenticación
 */
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authUser = api.getCurrentUser();
    if (authUser) {
      setUser(authUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const authUser = await api.login(
      credentials.username,
      credentials.password
    );
    setUser(authUser);
  };

  const register = async (data: RegisterData): Promise<void> => {
    const authUser = await api.register(
      data.name,
      data.username,
      data.password
    );
    setUser(authUser);
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const refreshCurrentUser = async (): Promise<void> => {
    const refreshedUser = await api.refreshUser();
    setUser(refreshedUser);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    refreshCurrentUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
};
