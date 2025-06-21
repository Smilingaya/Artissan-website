// This version of PostDialog includes a Swiper slider for multiple media (images/videos)
// and uses MUI icons for navigation. The layout mimics Instagram with media left and content right.

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog, Box, IconButton, Avatar, Typography, Divider,
  TextField, List, ListItem, ListItemAvatar, ListItemText,
  Menu, MenuItem, Button
} from '@mui/material';
import {
  Close, Send, Favorite, FavoriteBorder, MoreVert,
  Delete, Edit, Link as LinkIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchPostComments } from '../../../features/profile/utils/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

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
  const [productMenuAnchor, setProductMenuAnchor] = useState(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const loadComments = async () => {
      if (post?._id) {
        try {
          const res = await fetchPostComments(post._id);
          const updated = res.comments.map(c => ({
            ...c,
            isOwnComment:
              (currentUser && c.user === currentUser._id) ||
              c.user?._id === currentUser._id
          }));
          setComments(updated);
        } catch (error) {
          console.error('Error loading comments:', error);
        }
      }
    };
    if (open && post?._id) {
      loadComments();
    }
  }, [open, post?._id, currentUser , comments]);

  useEffect(() => {
    if (swiperRef.current?.params && swiperRef.current.navigation) {
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, [open]);

  const handleUserClick = () => {
    if (post.user?._id) {
      navigate(`/profile/${post.user._id}`);
    }
  };

  const handleLikeClick = () => onLike?.(post._id);
  const handleEdit = () => { onEdit?.(post); setAnchorEl(null); };
  const handleDelete = () => { onDelete?.(post._id); setAnchorEl(null); };
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await onAddComment?.(post._id, newComment);
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

  const handleProductMenuOpen = (e) => setProductMenuAnchor(e.currentTarget);
  const handleProductMenuClose = () => setProductMenuAnchor(null);

  const handleNavigateToProduct = (id) => {
    handleProductMenuClose();
    navigate(`/product/${id}`);
  };
console.log("Post productLinks:", post.productLinks);
  const mediaItems = Array.isArray(post.media) ? post.media : [post.media];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ display: 'flex', height: '80vh' }}>
        {/* Left: Media Swiper */}
        <Box sx={{ width: '50%', flex: 1, bgcolor: 'black', position: 'relative' }}>
          <Swiper
            ref={swiperRef}
            modules={[Navigation]}
            navigation
            spaceBetween={10}
            slidesPerView={1}
            style={{ height: '100%' }}
          >
            {mediaItems.map((url, i) => (
              <SwiperSlide key={i}>
                {url.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video controls style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
                    <source src={url} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={url}
                    alt={`media-${i}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* Right: Post info */}
        <Box sx={{ width: 400, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Avatar onClick={handleUserClick} src={post.user?.profilePicture || ''} sx={{ mr: 1, cursor: 'pointer' }} />
            <Typography onClick={handleUserClick} variant="subtitle2" sx={{ flexGrow: 1, cursor: 'pointer' }}>{post.user?.name || 'User'}</Typography>
            {Array.isArray(post.productLinks) && post.productLinks.length > 0 && (
              <Button
  onClick={handleProductMenuOpen}
  variant="outlined"
  startIcon={<LinkIcon />}
>
  See Products
</Button>
            )}
            {isOwnPost && (
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}><MoreVert /></IconButton>
            )}
            <IconButton onClick={onClose}><Close /></IconButton>
          </Box>

          <Menu anchorEl={productMenuAnchor} open={Boolean(productMenuAnchor)} onClose={handleProductMenuClose}>
            {post.productLinks.map((prod, i) => (
              <MenuItem key={i} onClick={() => handleNavigateToProduct(prod._id)}>
                {prod.name} - DA {prod.price}
              </MenuItem>
            ))}
          </Menu>

          <Divider />

          <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
            <Typography variant="body2" sx={{ mb: 2 }}>{post.caption}</Typography>
            <List>
              {comments.map(comment => (
                <ListItem key={comment._id} disableGutters>
                  <ListItemAvatar>
                    <Avatar src={comment.user?.profilePicture || ''} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">{comment.user?.name || 'User'}</Typography>
                        {(comment.isOwnComment || isOwnPost) && (
                          <IconButton size="small" onClick={() => handleDeleteComment(comment._id)}><Delete fontSize="small" /></IconButton>
                        )}
                      </Box>
                    }
                    secondary={comment.comment}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
            <IconButton onClick={handleLikeClick}>
              {post.isLiked ? <Favorite color="primary" /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="body2">{post.likes?.length || 0} likes</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
            <IconButton onClick={handleAddComment}><Send /></IconButton>
          </Box>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleEdit}><Edit fontSize="small" sx={{ mr: 1 }} /> Edit</MenuItem>
            <MenuItem onClick={handleDelete}><Delete fontSize="small" sx={{ mr: 1 }} /> Delete</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Dialog>
  );
};

export default PostDialog;
