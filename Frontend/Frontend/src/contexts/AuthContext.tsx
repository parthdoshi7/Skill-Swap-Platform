import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AuthState } from '@/types';
import { getCurrentUser, setCurrentUser, saveUser, generateId } from '@/lib/storage';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
      });
    }
  }, []);

  const updateCurrentUser = (updatedUser: User) => {
    saveUser(updatedUser);
    setCurrentUser(updatedUser);
    setAuthState({
      user: updatedUser,
      isAuthenticated: true,
      isAdmin: updatedUser.role === 'admin',
    });
  };

  const login = async (email: string, password: string) => {
    // For demo purposes, we're not actually checking passwords
    // In a real app, you would validate credentials against a backend
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = JSON.parse(localStorage.getItem('skillSwap_users') || '[]');
      const user = users.find((u: User) => u.email === email);
      
      if (user) {
        setCurrentUser(user);
        setAuthState({
          user,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = JSON.parse(localStorage.getItem('skillSwap_users') || '[]');
      const userExists = users.some((u: User) => u.email === email);
      
      if (userExists) {
        return false;
      }
      
      const newUser: User = {
        id: generateId(),
        name,
        email,
        skillsOffered: [],
        skillsWanted: [],
        availability: [],
        isPublic: true,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      localStorage.setItem('skillSwap_users', JSON.stringify(users));
      
      setCurrentUser(newUser);
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isAdmin: false,
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    });
    navigate('/');
  };

  const value = {
    ...authState,
    login,
    register,
    logout,
    updateCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};