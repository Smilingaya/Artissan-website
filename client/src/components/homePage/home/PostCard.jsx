import React from 'react';
import { 
  Card, CardMedia, CardContent, Typography, Chip, Box, Avatar
} from '@mui/material';

const PostCard = ({ post, onClick }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: '0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
        },
        cursor: 'pointer'
      }}
      onClick={() => onClick(post)}
    >
      <CardMedia
        component="img"
        height="200"
        image={post.image}
        alt={post.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {post.title}
          </Typography>
          <Chip size="small" label={post.price} color="primary" />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {post.description}
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={post.user.profilePic} 
              sx={{ width: 24, height: 24, mr: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {post.user.name}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {post.created}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard;