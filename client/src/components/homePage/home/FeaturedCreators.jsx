import React from 'react';
import { Paper, Typography, Grid } from '@mui/material';
import CreatorCard from './CreatorCard';

const FeaturedCreators = ({ creators, navigateToProfile }) => {
  return (
    <Paper sx={{ p: 3, mt: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Featured Creators
      </Typography>
      <Grid container spacing={2}>
        {creators.map((creator) => (
          <Grid item xs={6} sm={3} key={creator.id}>
            <CreatorCard creator={creator} navigateToProfile={navigateToProfile} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default FeaturedCreators;