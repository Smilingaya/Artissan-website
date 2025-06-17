import React from 'react';
import { Paper, Typography } from '@mui/material';

const QuickActionCard = ({ icon, title, description }) => {
  return (
    <Paper 
      sx={{ 
        p: 2, 
        borderRadius: 2, 
        bgcolor: '#f9f9f9',
        textAlign: 'center',
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      {icon}
      <Typography variant="subtitle1" sx={{ fontWeight: 500, my: 1, fontSize: '0.9rem' }}>{title}</Typography>
      <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>{description}</Typography>
    </Paper>
  );
};

export default QuickActionCard;