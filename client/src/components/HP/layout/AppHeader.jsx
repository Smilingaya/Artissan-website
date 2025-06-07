import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import SearchBar from '../common/SearchBar';
import UserMenu from '../common/UserMenu';

const AppHeader = ({ searchQuery, setSearchQuery, toggleDrawer }) => {
  const handleDrawerOpen = () => {
    if (typeof toggleDrawer === 'function') {
      toggleDrawer(true);
    }
  };

  return (
    <AppBar 
      position="fixed" 
      color="primary"
      elevation={2}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        width: '100%',
        transition: 'all 0.3s ease'
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleDrawerOpen}
          sx={{ 
            mr: 2,
            display: { sm: 'none' }
          }}
        >
          <CategoryIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Artisan
        </Typography>
        
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </Box>
        
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader; 