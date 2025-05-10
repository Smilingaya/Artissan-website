import React from 'react';
import {
  Drawer, Box, Typography, Divider, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PublicIcon from '@mui/icons-material/Public';

const SideDrawer = ({ categories, categoryTab, setCategoryTab, drawerOpen, toggleDrawer }) => {
  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={toggleDrawer(false)}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" component="div">
            Artisan Menu
          </Typography>
        </Box>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ExploreIcon />
            </ListItemIcon>
            <ListItemText primary="Explore" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText primary="Trending" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <PublicIcon />
            </ListItemIcon>
            <ListItemText primary="Marketplace" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem>
            <Typography variant="subtitle2" color="textSecondary">
              Browse Categories
            </Typography>
          </ListItem>
          {categories.map((category, index) => (
            <ListItem button key={category} 
              onClick={() => setCategoryTab(index)}
              selected={categoryTab === index}>
              <ListItemText primary={category} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default SideDrawer;