import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Badge,
  styled
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  ShoppingBag as OrdersIcon,
  Store as SellerIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/UserContext';

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 80;

// Styled components
const StyledDrawer = styled(Drawer)(({ theme, ishovered }) => ({
  width: ishovered === 'true' ? drawerWidthExpanded : drawerWidthCollapsed,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  transition: 'width 0.3s ease',
  '& .MuiDrawer-paper': {
    width: ishovered === 'true' ? drawerWidthExpanded : drawerWidthCollapsed,
    backgroundColor: '#1A1C1E',
    color: '#fff',
    borderRadius: '0 20px 20px 0',
    
    //margin: '16px',
    //height: 'calc(100% - 32px)',
    border: 'none',
    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'width 0.3s ease',
    zIndex: theme.zIndex.drawer + 2,
    position: 'fixed',
    top: 0,
    left: 0
  },
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
 
  borderRadius: '12px',
  color: active ? '#fff' : 'rgba(255,255,255,0.7)',
  backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
  padding: '12px 5px',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#fff',
  },
  transition: 'all 0.2s ease',
  minHeight: '48px',
}));

const StyledListItemIcon = styled(ListItemIcon)({
  color: 'inherit',
  minWidth: '40px',
  display: 'flex',
  justifyContent: 'center',
});

const StyledListItemText = styled(ListItemText)(({ ishovered }) => ({
  opacity: ishovered === 'true' ? 1 : 0,
  transition: 'opacity 0.2s ease',
  whiteSpace: 'nowrap',
}));

const SideDrawer = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/home' },
    { text: 'Messages', icon: <Badge badgeContent={4} color="error"><MessageIcon /></Badge>, path: '/message' },
    { text: 'Profile', icon: <PersonIcon />, path: currentUser ? `/profile/${currentUser._id}` : '/profile' },
    { text: 'My Orders', icon: <OrdersIcon />, path: '/my-orders' },
    { text: 'My Shop', icon: <SellerIcon />, path: '/artisan-orders' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <StyledDrawer
      variant="permanent"
      anchor="left"
      open={open}
      ishovered={isHovered.toString()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isHovered ? 'flex-start' : 'center',
          mb: 4,
          minHeight: '48px'
        }}>
          {isHovered ? (
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                color: '#fff',
              }}
            >
              Artisan
            </Typography>
          ) : (
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                color: '#fff',
                fontSize: '24px'
              }}
            >
              A
            </Typography>
          )}
        </Box>

        <List sx={{ p: 0 }}>
          {menuItems.map((item) => (
            <StyledListItem
              button
              key={item.text}
              onClick={() => handleNavigate(item.path)}
              active={location.pathname === item.path ? 1 : 0}
            >
              <StyledListItemIcon>
                {item.icon}
              </StyledListItemIcon>
              <StyledListItemText 
                primary={item.text}
                ishovered={isHovered.toString()}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: location.pathname === item.path ? 600 : 400
                }}
              />
            </StyledListItem>
          ))}
        </List>

        {/* Logout at the bottom */}
        <Box sx={{ mt: 'auto', mb: 2 }}>
          <StyledListItem 
            button 
            onClick={handleLogout}
          >
            <StyledListItemIcon>
              <LogoutIcon />
            </StyledListItemIcon>
            <StyledListItemText 
              primary="Log out"
              ishovered={isHovered.toString()}
              primaryTypographyProps={{
                fontSize: '0.9rem'
              }}
            />
          </StyledListItem>
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export default SideDrawer; 