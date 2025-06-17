import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import PlatformStatCard from './PlatformStatCard';
import QuickActionCard from './QuickActionCard';
import {
  Person as PersonIcon,
  PostAdd as PostAddIcon,
  ShoppingCart as ShoppingCartIcon,
  ManageAccounts as ManageAccountsIcon,
} from '@mui/icons-material';
import Inventory from '@mui/icons-material/Inventory';
import Settings from '@mui/icons-material/Settings';

const PlatformView = () => {
  const platformStats = {
    users: 1243,
    posts: 3487,
    products: 872,
    orders: 546
  };
  return (
    <Box sx={{ p: 3,mt:8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 500, color: '#333' }}>
          Platform Overview
        </Typography>
        <Box 
          sx={{ 
            bgcolor: '#2E8B57', 
            color: 'white', 
            py: 0.75, 
            px: 2, 
            borderRadius: 10,
            fontSize: '0.85rem',
            fontWeight: 500
          }}
        >
          Admin View
        </Box>
      </Box>
      
      {/* Platform Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <PlatformStatCard 
            icon={<PersonIcon fontSize="large" sx={{ color: '#2196F3' }} />}
            title="Users"
            value={platformStats.users}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PlatformStatCard 
            icon={<PostAddIcon fontSize="large" sx={{ color: '#FF9800' }} />}
            title="Posts"
            value={platformStats.posts}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PlatformStatCard 
            icon={<Inventory fontSize="large" sx={{ color: '#9C27B0' }} />}
            title="Products"
            value={platformStats.products}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PlatformStatCard 
            icon={<ShoppingCartIcon fontSize="large" sx={{ color: '#4CAF50' }} />}
            title="Orders"
            value={platformStats.orders}
          />
        </Grid>
      </Grid>
      
      {/* Platform Content */}
      <Grid container spacing={3}>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>Quick Actions</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <QuickActionCard 
                  icon={<PostAddIcon sx={{ fontSize: 40, color: '#2E8B57' }} />}
                  title="View All Posts"
                  description="Browse and moderate all platform posts"
                />
              </Grid>
              <Grid item xs={6}>
                <QuickActionCard 
                  icon={<Inventory sx={{ fontSize: 40, color: '#2E8B57' }} />}
                  title="Manage Products"
                  description="View and edit all platform products"
                />
              </Grid>
              <Grid item xs={6}>
                <QuickActionCard 
                  icon={<ManageAccountsIcon sx={{ fontSize: 40, color: '#2E8B57' }} />}
                  title="User Management"
                  description="Browse and manage platform users"
                />
              </Grid>
              <Grid item xs={6}>
                <QuickActionCard 
                  icon={<Settings sx={{ fontSize: 40, color: '#2E8B57' }} />}
                  title="Platform Settings"
                  description="Configure platform parameters"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlatformView;