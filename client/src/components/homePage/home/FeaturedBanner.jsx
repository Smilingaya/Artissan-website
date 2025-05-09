import React from 'react';
import { Paper, Grid, Typography, Button } from '@mui/material';

const FeaturedBanner = () => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 2,
        backgroundImage: 'linear-gradient(to right, #6a1b9a, #9c27b0)',
        color: 'white'
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Discover Unique Handcrafted Treasures
          </Typography>
          <Typography variant="subtitle1" paragraph>
            Explore thousands of handmade items created by talented artisans from around the world.
            Each piece tells a story and brings a touch of uniqueness to your life.
          </Typography>
          <Button variant="contained" color="secondary" size="large">
            Explore Now
          </Button>
        </Grid>
        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
          <img 
            src="/api/placeholder/400/200" 
            alt="Featured crafts" 
            style={{ maxWidth: '100%', borderRadius: '8px' }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FeaturedBanner;