import React from 'react';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';

export const ThemeContext = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};