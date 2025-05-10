import React from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const SettingsMenu = ({ anchorEl, onClose }) => {
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    // Implement logout logic (e.g., clear cookies, redirect to login)
    onClose();
  };

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={handleLogout}>
        <LogoutIcon sx={{ mr: 1 }} />
        Logout
      </MenuItem>
      <MenuItem onClick={onClose}>
        <SettingsIcon sx={{ mr: 1 }} />
        Settings
      </MenuItem>
    </Menu>
  );
};

export default SettingsMenu;
