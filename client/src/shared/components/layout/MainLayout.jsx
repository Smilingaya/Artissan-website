import React from 'react';
import { Box } from '@mui/material';
// import AppHeader from '../AppHeader';
import SideDrawer from './SideDrawer';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <SideDrawer open={true} />
      <Box sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 