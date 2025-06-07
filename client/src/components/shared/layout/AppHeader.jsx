import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Container,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Home,
  Notifications,
  Message,
  Add,
  Person,
  ExitToApp
} from '@mui/icons-material';

const AppHeader = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate(`/profile/${user._id}`);
    handleMenuClose();
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    onLogout?.();
    handleMenuClose();
  };

  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
          {/* Logo/Brand */}
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              cursor: 'pointer',
              fontWeight: 700,
              color: 'primary.main'
            }}
            onClick={handleHomeClick}
          >
            Artissan
          </Typography>

          {/* Navigation Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" onClick={handleHomeClick}>
              <Home />
            </IconButton>
            <IconButton color="inherit">
              <Message />
            </IconButton>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/create')}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Create
            </Button>
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                src={user?.avatar}
                alt={user?.name}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Box>

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <Person sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppHeader; 