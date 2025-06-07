import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  ToggleButtonGroup,
  ToggleButton,
  useTheme
} from '@mui/material';
import { GridView, ViewList } from '@mui/icons-material';
import { 
  BookmarkBorder as BookmarkIcon,
  ShoppingBag as ShopIcon,
  Add as AddIcon
} from '@mui/icons-material';

const ProfileTabs = ({ 
  activeTab, 
  setActiveTab, 
  viewMode, 
  setViewMode, 
  isOwnProfile,
  handleCreatePost 
}) => {
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: 1,
      borderColor: 'divider',
      mb: 3,
      px: 2
    }}>
      <Tabs 
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        <Tab 
          value="posts" 
          label="Posts"
          sx={{
            '&.Mui-selected': {
              color: theme.palette.primary.main,
            },
          }}
        />
        <Tab 
          value="products" 
          label="Products"
          sx={{
            '&.Mui-selected': {
              color: theme.palette.primary.main,
            },
          }}
        />
      </Tabs>

      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewChange}
        size="small"
      >
        <ToggleButton value="grid">
          <GridView />
        </ToggleButton>
        <ToggleButton value="list">
          <ViewList />
        </ToggleButton>
      </ToggleButtonGroup>

      {activeTab === 'posts' && (
        <>
          {isOwnProfile && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={handleCreatePost}
            >
              New Post
            </Button>
          )}
        </>
      )}
    </Box>
  );
};

export default ProfileTabs;