import React, { useState } from 'react';
import { 
  IconButton, Menu, MenuItem, Divider, Tooltip, Badge
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Add new item">
        <IconButton color="inherit">
          <AddCircleIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Messages">
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MessageIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Tooltip title="Notifications">
        <IconButton color="inherit">
          <Badge badgeContent={7} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Tooltip title="Profile">
        <IconButton
          color="inherit"
          onClick={handleMenuOpen}
        >
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;