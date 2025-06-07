import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StepHeader = ({ title, onBack }) => {
  return (
    <Box 
      sx={{ 
        backgroundColor: 'rgba(94, 53, 177, 0.3)', // light glass purple
        backdropFilter: 'blur(10px)',
        color: 'white',
        p: 2,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <IconButton 
        onClick={onBack} 
        sx={{ 
          color: 'white',
          p: 0.5,
          mr: 1
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h6">{title}</Typography>
    </Box>
  );
};

export default StepHeader;
