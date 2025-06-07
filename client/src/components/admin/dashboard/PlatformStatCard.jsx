import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import CircleProgressChart from './CircleProgressChart';

const PlatformStatCard = ({ icon, title, value }) => {
  return (
    <Paper 
      sx={{ 
        p: 3, 
        borderRadius: 2, 
        display: 'flex', 
        alignItems: 'center', 
        height: '100%'
      }}
    >

      <CircleProgressChart percentage={70} />
      {icon}
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 500 }}>{title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 500, color: '#333' }}>{value}</Typography>
      </Box>
    </Paper>
  );
};

export default PlatformStatCard;