// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', {
        username,
        password,
      });

      const { access, refresh, user } = response.data;
      setToken(access);
      setUser(user);

      localStorage.setItem('refreshToken', refresh);

      console.log('Login successful for user:', user.username);
      console.log('User object:', user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  const checkAuth = async () => {
    if (token) {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/profile/');
        setUser(response.data);
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Admin detection - first check Django admin fields, then fallback to username pattern
  const getIsAdmin = () => {
    if (!user) return false;

    // First, check if Django admin fields exist (after you update the serializer)
    if (user.is_staff || user.is_superuser) {
      console.log('Admin detected via Django fields');
      return true;
    }

    // Fallback: Check username pattern (temporary solution)
    const adminUsernames = [
      'admin',
      'administrator',
      'airadmin',
      'superuser',
      'staff'
    ].map(name => name.toLowerCase());

    const isAdminByUsername = adminUsernames.includes(user.username?.toLowerCase());

    if (isAdminByUsername) {
      console.log('Admin detected via username pattern');
    }

    return isAdminByUsername;
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: getIsAdmin(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};