import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('opspilot_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('opspilot_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('opspilot_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password, role) => {
    const res = await API.post('/auth/register', { name, email, password, role });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('opspilot_user', JSON.stringify(userData));
    return userData;
  };

  const demoLogin = async (role = 'Operations Manager') => {
    const email = role === 'Operations Manager' ? 'manager@opspilot.ai' : 'officer@opspilot.ai';
    return await login(email, 'password123');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('opspilot_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
