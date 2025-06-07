import React from 'react';
import { Box } from '@mui/material';
import AppHeader from '../../HP/layout/AppHeader';
import SideDrawer from '../../HP/layout/SideDrawer';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <SideDrawer open={true} />
      
      <Box sx={{ 
        flexGrow: 1,
        paddingLeft: { xs: 0, sm: '96px' },
        paddingTop: '64px',
        transition: 'padding-left 0.3s ease'
      }}>
        <AppHeader />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 