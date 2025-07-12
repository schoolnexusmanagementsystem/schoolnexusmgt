
import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'super-admin' | 'school-admin' | 'teacher' | 'student' | 'parent' | 'visitor';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>({
    id: '1',
    name: 'John Smith',
    email: 'admin@example.com',
    role: 'school-admin',
    schoolId: 'school-1',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  });

  const setUser = (newUser: User) => {
    setUserState(newUser);
    localStorage.setItem('school-nexus-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem('school-nexus-user');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
