import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { STORAGE_KEYS, ROLES } from '../utils/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user từ localStorage khi app khởi động
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      return { success: true, message: 'Registration successful' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  const isAuthenticated = () => !!user;
  const hasRole = (role) => user?.role === role;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated,
      hasRole,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};