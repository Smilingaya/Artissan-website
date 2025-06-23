import React from 'react';
import { IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/UserContext';

const UserMenu = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    if (currentUser) {
      navigate(`/profile/${currentUser._id}`);
    } else {
      navigate('/profile');
    }
    handleClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    handleClose();
  };
  console.log(currentUser);

  return (
    <div>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <Avatar 
          src={currentUser?.profilePicture || undefined}
          alt={currentUser?.name || 'User'}
          sx={{ width: 32, height: 32 }}
        >
          {(!currentUser?.profilePicture && currentUser?.name) ? currentUser.name[0].toUpperCase() : null}
        </Avatar>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu; 