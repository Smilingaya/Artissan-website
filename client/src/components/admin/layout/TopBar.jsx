import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box,
  Avatar,
  IconButton,
  Badge,
  useTheme
} from '@mui/material';
import {
  NotificationsOutlined as NotificationsIcon,
  SearchOutlined as SearchIcon,
  SettingsOutlined as SettingsIcon
} from '@mui/icons-material';

export const TopBar = () => {
  const theme = useTheme();

  return (
    <AppBar 
      position="fixed" 
      color="transparent" 
      elevation={0} 
      sx={{ 
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        backgroundColor: 'background.paper',
        backdropFilter: 'blur(20px)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ 
          color: theme.palette.text.primary,
          fontWeight: 600 
        }}>
          Good morning, Dr.Admin
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton size="large" color="inherit">
            <SearchIcon sx={{ color: theme.palette.text.secondary }} />
          </IconButton>
          
          <IconButton size="large">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon sx={{ color: theme.palette.text.secondary }} />
            </Badge>
          </IconButton>

          <IconButton size="large">
            <SettingsIcon sx={{ color: theme.palette.text.secondary }} />
          </IconButton>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            ml: 2,
            pl: 2,
            borderLeft: '1px solid rgba(0, 0, 0, 0.08)' 
          }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ 
                color: theme.palette.text.primary,
                fontWeight: 600 
              }}>
                Admin User
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Super Admin
              </Typography>
            </Box>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                bgcolor: theme.palette.primary.main
              }}
            >
              A
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;