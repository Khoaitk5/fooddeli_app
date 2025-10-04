import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { STORAGE_KEYS, ROLES } from '../utils/constants';

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

  const login = async (email, _password) => { // eslint-disable-line no-unused-vars
    // Mock login - luôn thành công
    const mockUser = {
      id: 1,
      email: email,
      name: 'Demo User',
      role: ROLES.CUSTOMER
    };
    const mockToken = 'mock-token-' + Date.now();
    
    localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    setUser(mockUser);
    return { success: true };
  };

  const register = async (_userData) => { // eslint-disable-line no-unused-vars
    // Mock registration - luôn thành công
    return { success: true, message: 'Registration successful' };
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