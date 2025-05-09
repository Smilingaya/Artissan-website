import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import SearchBar from '../common/SearchBar';
import UserMenu from '../common/UserMenu';

const AppHeader = ({ searchQuery, setSearchQuery, toggleDrawer }) => {
  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={toggleDrawer(true)}
          sx={{ mr: 2 }}
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
