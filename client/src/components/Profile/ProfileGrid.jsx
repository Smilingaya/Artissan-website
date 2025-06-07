import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, Card, CardMedia, Typography } from '@mui/material';
import { Favorite, ChatBubbleOutline } from '@mui/icons-material';

const ProfileGrid = ({ items = [], onItemClick }) => {
  if (!items || items.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 5,
        color: 'text.secondary'
      }}>
        <Typography variant="h6" gutterBottom>
          No posts yet
        </Typography>
        <Typography variant="body2">
          When you share posts, they will appear here.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {items.map(item => (
        <Grid item xs={12} sm={6} md={4} key={item._id}>
          <Card 
            sx={{ 
              position: 'relative',
              cursor: 'pointer',
              "&:hover": {
                opacity: 0.9,
                transition: '0.3s'
              }
            }}
            onClick={() => onItemClick(item)}
          >
            <CardMedia
              component="img"
              alt={item.title}
              height="280"
              image={item.image}
              sx={{ objectFit: 'cover' }}
            />
            <Box 
              sx={{ 
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                p: 1,
                display: 'flex',
                justifyContent: 'space-around'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Favorite sx={{ mr: 0.5, fontSize: 16 }} />
                {item.likes}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ChatBubbleOutline sx={{ mr: 0.5, fontSize: 16 }} />
                {item.comments}
              </Box>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

ProfileGrid.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      likes: PropTypes.number.isRequired,
      comments: PropTypes.number.isRequired
    })
  ),
  onItemClick: PropTypes.func.isRequired
};

export default ProfileGrid;