import { useState, useEffect } from 'react';

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
    // Mock login - in real app, this would call your API
    const mockUser: User = {
      id: '1',
      name: 'Alex Johnson',
      email,
      role: email.includes('admin') ? 'admin' : 'student',
      college: 'MIT',
      branch: 'Computer Science',
      year: 3,
      achievements: ['academic-excellence', 'community-contributor']
    };
    setUser(mockUser);
    return mockUser;
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    // Mock registration - in real app, this would call your API
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      role: 'student',
      college: userData.college || '',
      branch: userData.branch || '',
      year: userData.year || 1,
      achievements: []
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  return { user, login, register, logout };
};