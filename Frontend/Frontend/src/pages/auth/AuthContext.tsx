// src/contexts/AuthContext.tsx

import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create Axios instance
const apiClient = axios.create({
  baseURL: 'https://odoo-hackathon-vk0o.onrender.com ',
  withCredentials: true, // Important if using session cookies
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/api/login', {
        email,
        password,
      });

      if (response.status === 200 && response.data.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      return false;
    }
  };

  const logout = () => {
    // Optional: Call logout API or clear session
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};