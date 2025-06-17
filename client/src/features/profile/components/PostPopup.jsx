import React from 'react';
import { Box ,Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { Close, ThumbUpAlt, Comment, Share } from '@mui/icons-material';

const PostPopup = ({ post, onClose }) => {
  return (
    <Dialog open={Boolean(post)} onClose={onClose}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{post?.title}</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <img src={post?.image} alt={post?.title} style={{ width: '100%', height: 'auto' }} />
        <Typography variant="body1">{post?.description}</Typography>

        {/* Like/Comment/Share */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <IconButton>
            <ThumbUpAlt />
            <Typography variant="body2">Like</Typography>
          </IconButton>
          <IconButton>
            <Comment />
            <Typography variant="body2">Comment</Typography>
          </IconButton>
          <IconButton>
            <Share />
            <Typography variant="body2">Share</Typography>
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PostPopup;
