import React, { useContext, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
  styled
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Block as BlockIcon,
  Public as PublicIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { AppContext } from "../../contexts/AppContext";
import { useAuth } from '../../../../shared/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const drawerWidthExpanded = 280;
const drawerWidthCollapsed = 80;

const StyledDrawer = styled(Drawer)(({ ishovered, theme }) => ({
  width: ishovered === 'true' ? drawerWidthExpanded : drawerWidthCollapsed,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  '& .MuiDrawer-paper': {
    width: ishovered === 'true' ? drawerWidthExpanded : drawerWidthCollapsed,
    backgroundColor: '#1A1C1E',
    color: '#fff',
    border: 'none',
    borderRadius: '0 20px 20px 0',
    transition: 'width 0.3s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflowX: 'hidden',
    zIndex: theme.zIndex.drawer + 2,
  },
}));

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ active }) => ({
  borderRadius: '12px',
  color: active ? '#fff' : 'rgba(255,255,255,0.7)',
  backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
  padding: '12px 8px',
  cursor: 'pointer',
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

export const Sidebar = () => {
  const { currentView, setCurrentView } = useContext(AppContext);
  const [isHovered, setIsHovered] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, view: 'dashboard' },
    { text: 'Categories', icon: <CategoryIcon />, view: 'categories' },
    { text: 'Blacklist', icon: <BlockIcon />, view: 'blacklist' },
    { text: 'Platform', icon: <PublicIcon />, view: 'platform' },
  ];

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <StyledDrawer
      variant="permanent"
      ishovered={isHovered.toString()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isHovered ? 'space-between' : 'center',
        minHeight: '64px'
      }}>
        {isHovered ? (
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Admin Panel</Typography>
        ) : (
          <Typography variant="h4" sx={{ fontWeight: 600 }}>A</Typography>
        )}
        {isHovered && (
          <IconButton sx={{ color: '#fff' }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <List sx={{ p: 1 }}>
        {menuItems.map((item) => (
          <StyledListItem
            button
            key={item.text}
            onClick={() => handleNavigate(item.view)}
            active={currentView === item.view ? 1 : 0}
          >
            <StyledListItemIcon>
              {item.icon}
            </StyledListItemIcon>
            <StyledListItemText
              primary={item.text}
              ishovered={isHovered.toString()}
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: currentView === item.view ? 600 : 400
              }}
            />
          </StyledListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mx: 1 }} />

      <Box sx={{ mt: 'auto', mb: 2, px: 1 }}>
        <StyledListItem button onClick={handleLogout} sx={{cursor:'pointer'}}>
          <StyledListItemIcon>
            <LogoutIcon />
          </StyledListItemIcon>
          <StyledListItemText
            primary="Logout"
            ishovered={isHovered.toString()}
            primaryTypographyProps={{
              fontSize: '0.9rem'
            }}
          />
        </StyledListItem>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;
