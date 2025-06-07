import React, { createContext, useState, useEffect } from 'react';

// Mock user data
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://i.pravatar.cc/300'
};

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Simulate loading user data
    setCurrentUser(mockUser);
  }, []);

  const login = (credentials) => {
    // Mock login functionality
    setCurrentUser(mockUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUser = (userData) => {
    setCurrentUser(prev => ({ ...prev, ...userData }));
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      login, 
      logout,
      updateUser
    }}>
      {children}
    </UserContext.Provider>
  );
}; 