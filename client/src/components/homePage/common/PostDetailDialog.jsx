import React from 'react';
import {
  Dialog, DialogContent, IconButton, Grid, Box, Avatar, Typography,
  Divider, Chip, Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';

const PostDetailDialog = ({ post, open, onClose, navigateToProfile }) => {
  if (!post) return null;
  
  return (
    <Dialog
      open={open}
      maxWidth="lg"
      fullWidth
      onClose={onClose}
    >
      <DialogContent sx={{ p: 0 }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.5)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Grid container>
          <Grid item xs={12} md={7}>
            <img 
              src={post.image} 
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  onClose();
                  navigateToProfile(post.user.id);
                }}
              >
                <Avatar src={post.user.profilePic} sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle1">
                    {post.user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.user.followers.toLocaleString()} followers
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ ml: 'auto' }}
                >
                  Follow
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="h5" gutterBottom>
                {post.title}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Chip label={post.category} size="small" />
                <Typography variant="h6" color="primary">
                  {post.price}
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph>
                {post.description}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                {post.tags.map(tag => (
                  <Chip 
                    key={tag} 
                    label={`#${tag}`} 
                    size="small" 
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
              
              <Box sx={{ mt: 'auto' }}>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <IconButton>
                      <FavoriteIcon color={Math.random() > 0.5 ? "secondary" : "inherit"} />
                    </IconButton>
                    <IconButton>
                      <BookmarkIcon />
                    </IconButton>
                    <IconButton>
                      <ShareIcon />
                    </IconButton>
                  </Box>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                  >
                    Purchase
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailDialog;