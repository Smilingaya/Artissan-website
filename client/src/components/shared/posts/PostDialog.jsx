import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Avatar,
  CardMedia,
  Divider,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Close,
  Send,
  Favorite,
  FavoriteBorder,
  MoreVert,
  Comment,
  Share
} from '@mui/icons-material';

const PostDialog = ({
  post,
  open,
  onClose,
  onLike,
  onEdit,
  onDelete,
  isOwnPost
}) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (post && Array.isArray(post.comments)) {
      setComments(post.comments);
    } else {
      setComments([]);
    }
  }, [post]);

  if (!post) return null;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const newCommentObj = {
      id: Date.now(),
      text: newComment,
      user: {
        name: 'Current User',
        avatar: 'https://i.pravatar.cc/300',
      },
      timestamp: 'Just now'
    };

    setComments(prevComments => [...prevComments, newCommentObj]);
    setNewComment('');
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(post);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(post.id);
    handleMenuClose();
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLike?.(post.id);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={post.user.avatar}
          alt={post.user.name}
          sx={{ width: 40, height: 40 }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
            {post.user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.createdAt}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        {post.imageUrl && (
          <CardMedia
            component="img"
            image={post.imageUrl}
            alt={post.title || 'Post image'}
            sx={{ 
              width: '100%',
              maxHeight: '60vh',
              objectFit: 'contain',
              bgcolor: 'black'
            }}
          />
        )}
        <Box sx={{ p: 3 }}>
          {post.title && (
            <Typography variant="h6" gutterBottom>
              {post.title}
            </Typography>
          )}
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
            {post.content}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <IconButton onClick={handleLikeClick}>
              {post.isLiked ? <Favorite color="primary" /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {post.likes}
            </Typography>
            <IconButton>
              <Comment />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {post.comments?.length || 0}
            </Typography>
            <IconButton>
              <Share />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />
          
          {/* Comments Section */}
          <Typography variant="h6" gutterBottom>
            Comments ({comments.length})
          </Typography>
          
          <List sx={{ mb: 2 }}>
            {Array.isArray(comments) && comments.map((comment) => (
              <ListItem key={comment.id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={comment.user.avatar} alt={comment.user.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2">
                        {comment.user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {comment.timestamp}
                      </Typography>
                    </Box>
                  }
                  secondary={comment.text}
                />
              </ListItem>
            ))}
          </List>

          {/* Add Comment Section */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
            <IconButton 
              color="primary"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </DialogContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          Edit Post
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          Delete Post
        </MenuItem>
      </Menu>
    </Dialog>
  );
};

export default PostDialog; 