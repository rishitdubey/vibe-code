import { useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'club_rep' | 'counselor';
  avatar?: string;
  college: string;
  branch: string;
  year: number;
  achievements: string[];
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const data = await loginUser(email, password);
      setUser(data.user);
      return data.user;
    } catch (error: any) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    try {
      const data = await registerUser(userData);
      setUser(data.user);
      return data.user;
    } catch (error: any) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    setUser(null);
  };

  return { user, login, register, logout };
};