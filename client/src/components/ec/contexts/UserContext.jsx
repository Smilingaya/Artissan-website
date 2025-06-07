import React, { createContext, useState, useEffect } from 'react';

// Mock user data
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  isAdmin: true
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

  return (
    <UserContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};