import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  Share,
  Delete,
  Edit
} from '@mui/icons-material';
import { fetchPostComments } from '../../../features/profile/utils/api';

const PostDialog = ({
  post,
  open,
  onClose,
  onLike,
  onEdit,
  onDelete,
  onAddComment,
  onDeleteComment,
  isOwnPost,
  currentUser
}) => {
  const navigate = useNavigate();

  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
  const loadComments = async () => {
    if (post && post._id) {
      try {
        const res = await fetchPostComments(post._id);
        const commentsWithOwnership = res.comments.map(comment => ({
          ...comment,
          isOwnComment: currentUser && comment.user === currentUser._id || comment.user?._id === currentUser._id
        }));
        setComments(commentsWithOwnership);
      } catch (error) {
        console.error('Failed to load comments:', error);
        setComments([]);
      }
    }
  };

  if (open && post?._id) {
    loadComments();
  }
}, [open, post?._id, currentUser]);


  if (!post) return null;


  const handleUserClick = () => {
  if (post.user && typeof post.user === 'object' && post.user._id) {
    navigate(`/profile/${post.user._id}`);
  }
};

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      await onAddComment?.(post._id, newComment);

      // Always fetch all comments after adding
      const refreshed = await fetchPostComments(post._id);
      setComments(refreshed.comments || []);

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await onDeleteComment?.(commentId, post._id);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
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
    onDelete?.(post._id);
    handleMenuClose();
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLike?.(post._id);
  };

  const hasImage = post.media || (post.images && post.images.length > 0);
  const mainImage = post.media || (post.images && post.images[0]);

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
       { console.log('Post User:', post.user)}
        <IconButton onClick={handleUserClick} sx={{ p: 0 }}>
  <Avatar
    src={post.user?.profilePicture || ''}
    alt={post.user?.name || 'User'}
    sx={{ width: 40, height: 40 }}
  />
</IconButton>

        <Box sx={{ flex: 1 }}>
          <Typography
  variant="subtitle1"
  component="div"
  sx={{ fontWeight: 600, cursor: 'pointer' }}
  onClick={handleUserClick}
>
  {post.user?.name || 'User'}
</Typography>

          <Typography variant="body2" color="text.secondary">
            {post.createdAt}
          </Typography>
        </Box>
        {isOwnPost && (
          <IconButton onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        )}
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
        {hasImage && (
          <CardMedia
            component="img"
            image={mainImage}
            alt={post.name || 'Post image'}
            sx={{ 
              width: '100%',
              maxHeight: '60vh',
              objectFit: 'contain',
              bgcolor: 'black'
            }}
          />
        )}
        <Box sx={{ p: 3 }}>
          {post.name && (
            <Typography variant="h6" gutterBottom>
              {post.name}
            </Typography>
          )}
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
            {post.caption}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <IconButton onClick={handleLikeClick}>
              {post.isLiked ? <Favorite color="primary" /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {post.likes.length || 0}
            </Typography>
            <IconButton>
              <Comment />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {comments.length}
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
              <ListItem key={comment._id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar 
                    src={comment.user && typeof comment.user === 'object' ? (comment.user.avatar || comment.user.profilePicture) : ''} 
                    alt={comment.user && typeof comment.user === 'object' ? comment.user.name : 'User'} 
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2">
                        {comment.user && typeof comment.user === 'object' ? comment.user.name : 'User'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {comment.timestamp || comment.createdAt}
                        </Typography>
                        {(comment.isOwnComment || isOwnPost) && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteComment(comment._id, post._id)}
                            sx={{ p: 0.5 }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  }
                  secondary={comment.comment}
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
          <Edit sx={{ mr: 1 }} /> Edit Post
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete sx={{ mr: 1 }} /> Delete Post
        </MenuItem>
      </Menu>
    </Dialog>
  );
};

export default PostDialog; 