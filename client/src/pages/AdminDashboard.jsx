import React, { useState, useContext } from 'react';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { Sidebar } from '../components/admin/layout/Sidebar';
import { TopBar } from '../components/admin/layout/TopBar';
import Dashboard from '../components/admin/dashboard/Dashboard';
import Categories from '../components/admin/categories/Categories';
import Blacklist from '../components/admin/blacklist/Blacklist';
import PlatformView from '../components/admin/dashboard/PlatformView';
import { AppContext } from '../components/admin/context/AppContext';
import HomePage from "./HP";
import adminTheme from '../components/admin/theme/theme';

// Inner component that uses the context
const AdminDashboardContent = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const { currentView } = useContext(AppContext);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Render the current view based on the state
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'categories':
        return <Categories />;
      case 'blacklist':
        return <Blacklist />;
      case 'platform':
        return <HomePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', mt: '8' }}>
      <Sidebar open={drawerOpen} toggleDrawer={toggleDrawer} />
      <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
        <TopBar />
        {renderView()}
      </Box>
    </Box>
  );
};

// Main component that provides context and theme
export const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <AppContext.Provider value={{ currentView, setCurrentView }}>
        <AdminDashboardContent />
      </AppContext.Provider>
    </ThemeProvider>
  );
};

export default AdminDashboard;