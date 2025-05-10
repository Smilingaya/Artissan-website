import React from 'react';
import { Box, Avatar, Typography, Button } from '@mui/material';

const CreatorCard = ({ creator, navigateToProfile }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: 2,
        transition: '0.3s',
        '&:hover': {
          backgroundColor: 'rgba(0,0,0,0.04)',
          cursor: 'pointer'
        },
        borderRadius: 1
      }}
      onClick={() => navigateToProfile(creator.id)}
    >
      <Avatar 
        src={creator.profilePic} 
        sx={{ width: 80, height: 80, mb: 1 }}
      />
      <Typography variant="subtitle1">
        {creator.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {creator.followers.toLocaleString()} followers
      </Typography>
      <Button 
        variant="outlined" 
        size="small" 
        sx={{ mt: 1 }}
      >
        Follow
      </Button>
    </Box>
  );
};

export default CreatorCard;