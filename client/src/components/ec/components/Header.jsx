import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  IconButton, 
  Badge,
  Menu,
  MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { CartContext } from '../contexts/CartContext';
import { UserContext } from '../contexts/UserContext';
import SearchIcon from '@mui/icons-material/Search';

const StyledLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'none',
  marginLeft: '20px',
});

const Header = () => {
  const { cart } = useContext(CartContext);
  const { currentUser } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateTo = (path) => {
    navigate(path);
    handleClose();
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <AppBar position="static" color="secondary" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <StyledLink to="/">FOREVER.</StyledLink>
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <StyledLink to="/">HOME</StyledLink>
          <StyledLink to="/collection">COLLECTION</StyledLink>
          <StyledLink to="/about">ABOUT</StyledLink>
          <StyledLink to="/contact">CONTACT</StyledLink>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleMenu}>
            <PersonIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
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
            {currentUser ? (
              <>
                <MenuItem onClick={() => navigateTo('/my-orders')}>My Orders</MenuItem>
                <MenuItem onClick={() => navigateTo('/artisan-orders')}>Artisan Dashboard</MenuItem>
                <MenuItem onClick={() => navigateTo('/profile')}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </>
            ) : (
              <MenuItem onClick={handleClose}>Login</MenuItem>
            )}
          </Menu>
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={cartItemCount} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;