import React, { useContext } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  useTheme,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Block as BlockIcon,
  Public as PublicIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { AppContext } from '../context/AppContext';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, view: 'dashboard' },
  { text: 'Categories', icon: <CategoryIcon />, view: 'categories' },
  { text: 'Blacklist', icon: <BlockIcon />, view: 'blacklist' },
  { text: 'Platform', icon: <PublicIcon />, view: 'platform' },
];

export const Sidebar = ({ open, toggleDrawer }) => {
  const theme = useTheme();
  const { currentView, setCurrentView } = useContext(AppContext);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1A1C1E',
          borderRight: 'none',
          transition: 'all 0.3s ease',
          whiteSpace: 'nowrap',
          ...(open 
            ? { width: drawerWidth } 
            : { width: theme => theme.spacing(9) }),
          zIndex: 2000,
          boxShadow: '4px 0 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '4px 0 12px rgba(0,0,0,0.15)',
          },
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2.5, 
        justifyContent: 'space-between',
        height: 72,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
      }}>
        {open && (
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600, 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              opacity: open ? 1 : 0,
              transition: 'all 0.3s ease',
              fontSize: '1.25rem',
              letterSpacing: '0.5px'
            }}
          >
            <DashboardIcon sx={{ 
              color: 'white',
              fontSize: '28px',
              filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
            }} />
            Admin Panel
          </Typography>
        )}
        <IconButton 
          onClick={toggleDrawer} 
          sx={{ 
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              transform: 'scale(1.1)',
            }
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      
      <List sx={{ p: 2.5, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => handleNavigate(item.view)}
            sx={{ 
              mb: 1,
              borderRadius: 2.5,
              backgroundColor: currentView === item.view ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              color: currentView === item.view ? 'white' : 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: currentView === item.view 
                  ? 'rgba(255, 255, 255, 0.15)' 
                  : 'rgba(255, 255, 255, 0.05)',
                transform: 'translateX(4px)',
                color: 'white',
              },
              '& .MuiListItemIcon-root': {
                transition: 'all 0.3s ease',
              },
              '&:hover .MuiListItemIcon-root': {
                transform: 'scale(1.1)',
              },
              padding: '12px 16px',
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: currentView === item.view ? 'white' : 'rgba(255, 255, 255, 0.7)',
                minWidth: 40,
                '& svg': {
                  fontSize: '22px',
                  transition: 'all 0.3s ease',
                }
              }}
            >
              {item.icon}
            </ListItemIcon>
            {open && (
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: currentView === item.view ? 600 : 400,
                  letterSpacing: '0.3px'
                }}
                sx={{
                  opacity: open ? 1 : 0,
                  transition: 'all 0.3s ease',
                }}
              />
            )}
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      
      <List sx={{ p: 2.5 }}>
        <ListItem 
          button 
          onClick={handleLogout}
          sx={{ 
            borderRadius: 2.5,
            color: '#FF5555',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(255,85,85,0.1)',
              transform: 'translateX(4px)',
            },
            padding: '12px 16px',
          }}
        >
          <ListItemIcon sx={{ 
            color: 'inherit',
            minWidth: 40,
            '& svg': {
              fontSize: '22px',
              transition: 'all 0.3s ease',
            }
          }}>
            <LogoutIcon />
          </ListItemIcon>
          {open && (
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: 500,
                letterSpacing: '0.3px'
              }}
              sx={{
                opacity: open ? 1 : 0,
                transition: 'all 0.3s ease',
              }}
            />
          )}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;