import React from "react";
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Typography
} from "@mui/material";
import { FaSearch, FaBars, FaBell, FaComment } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  // Separate state for each menu
  const [anchorElMenu, setAnchorElMenu] = React.useState(null);      // Hamburger menu
  const [anchorElAvatar, setAnchorElAvatar] = React.useState(null);  // Avatar menu

  // Handlers for hamburger
  const handleMenuClick = (event) => {
    setAnchorElMenu(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  // Handlers for avatar
  const handleAvatarClick = (event) => {
    setAnchorElAvatar(event.currentTarget);
  };
  const handleCloseAvatarMenu = () => {
    setAnchorElAvatar(null);
  };

  return (
    <AppBar position="fixed" sx={{padding:"20px 10px 0", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" sx={{ flexGrow: 1, fontSize: "2rem", fontWeight: "bold", color: "blue" }}>
          Artison
        </Typography>

        {/* Hamburger Menu */}
        <Box>
          <IconButton onClick={handleMenuClick} edge="start"  sx={{ mr: 2 }}>
            <FaBars />
          </IconButton>
          <Menu anchorEl={anchorElMenu} open={Boolean(anchorElMenu)} onClose={handleCloseMenu}>
            <MenuItem onClick={handleCloseMenu}>Accessories</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Art & Collectibles</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Bags & Purses</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Gifts</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Clothing</MenuItem>
          </Menu>
        </Box>

        {/* Search Bar */}
        <InputBase
          placeholder="Search for anything"
          sx={{
            backgroundColor: "#f1f1f1",
            padding: "5px 10px",
            borderRadius: "4px",
            flex: 1,
            marginLeft: 2,
          }}
          startAdornment={<FaSearch />}
        />

        {/* Icons */}
        <Box sx={{ display: "flex", gap: 2, marginLeft: 2 }}>
          <IconButton >
            <FaBell />
          </IconButton>
          <IconButton >
            <FaComment />
          </IconButton>
        </Box>

        {/* Avatar Menu */}
        <Box sx={{ marginLeft: 2 }}>
          <IconButton onClick={handleAvatarClick}>
            <Avatar />
          </IconButton>
          <Menu
            anchorEl={anchorElAvatar}
            open={Boolean(anchorElAvatar)}
            onClose={handleCloseAvatarMenu}
          >
            <MenuItem onClick={() => {
              handleCloseAvatarMenu();
              navigate('/profile/1');
            }}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleCloseAvatarMenu}>Purchases and reviews</MenuItem>
            <MenuItem onClick={handleCloseAvatarMenu}>Messages</MenuItem>
            <MenuItem onClick={handleCloseAvatarMenu}>Special offers</MenuItem>
            <MenuItem onClick={handleCloseAvatarMenu}>Etsy Registry</MenuItem>
            <MenuItem onClick={handleCloseAvatarMenu}>Sell on Etsy</MenuItem>
            <MenuItem onClick={handleCloseAvatarMenu}>Help Center</MenuItem>
            <MenuItem onClick={handleCloseAvatarMenu}>Account settings</MenuItem>
            <MenuItem onClick={handleCloseAvatarMenu}>Sign out</MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      <Typography variant="h6" sx={{width:"80px", margin: "20px 0 0",justifySelf: "center" , fontWeight: "bold", borderBottom: "2px solid black" , color: "black", textAlign: "center" }}>
          for you
        </Typography>

    </AppBar>
  );
}

export default Navbar;
