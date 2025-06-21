import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StepHeader = ({ title, onBack }) => {
  return (
    <Box 
      sx={{ 
        background:  "linear-gradient(135deg,rgb(246, 255, 194) 0%,rgb(169, 171, 255) 100%)",
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
