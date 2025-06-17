import React, { createContext, useState } from 'react';

// Create a context for global state management
export const AppContext = createContext({
  currentView: 'dashboard',
  setCurrentView: () => {},
});