import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
  Avatar,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  MoreVert,
  Edit,
  Delete,
  Comment,
  Share,
  Block as BlockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/UserContext';

const PostCard = ({
  post,
  onLike,
  onEdit,
  onDelete,
  isOwnPost,
  onPostClick,
  onBlockUser,
  onViewProfile,
  variant = 'grid'
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

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

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(post._id);
    handleMenuClose();
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLike?.(post._id);
  };

  const handleCardClick = () => {
    onPostClick?.(post);
  };

  const handleBlockUser = (e) => {
    e.stopPropagation();
    onBlockUser?.(post.user);
    handleMenuClose();
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    onViewProfile?.(post.user?._id);
  };

  const mainMedia = Array.isArray(post.media) ? post.media[0] : post.media;
  const isVideo = mainMedia?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div>
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        cursor: 'pointer',
        '&:hover': { boxShadow: 3 }
      }}
      onClick={handleCardClick}
    >
      {mainMedia && (
        isVideo ? (
          <CardMedia
            component="video"
            src={mainMedia}
            controls
            sx={{
              maxHeight: 500,
              width: '100%',
              objectFit: 'contain',
              backgroundColor: 'black'
            }}
          />
        ) : (
          <CardMedia
            component="img"
            image={mainMedia}
            alt={post.name || 'Post media'}
            sx={{
              maxHeight: 500,
              width: '100%',
              objectFit: 'contain'
            }}
          />
        )
      )}
      <CardContent>
        {/* User info section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={post.user?.profilePicture}
            sx={{ mr: 1, cursor: 'pointer' }}
            onClick={handleViewProfile}
          />
          <Typography
            variant="subtitle2"
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={handleViewProfile}
          >
            {post.user?.name || 'Unknown User'}
          </Typography>
        </Box>
        
        {post.name && (
          <Typography variant="h6" gutterBottom>
            {post.name}
          </Typography>
        )}
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {post.caption}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLikeClick}>
          {post.isLiked ? <Favorite color="primary" /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {post.likes?.length || 0}
        </Typography>
        <IconButton onClick={handleCardClick}>
          <Comment />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {post.Comments?.length || 0}
        </Typography>
        <IconButton>
          <Share />
        </IconButton>
        
        {/* Admin controls */}
        {isAdmin && !isOwnPost && (
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              color="primary"
              onClick={handleViewProfile}
              title="View Profile"
            >
              <PersonIcon />
            </IconButton>
            <IconButton
              size="small"
              color="warning"
              onClick={handleBlockUser}
              title="Block User"
            >
              <BlockIcon />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={handleDelete}
              title="Delete Post (Admin)"
            >
              <Delete />
            </IconButton>
          </Box>
        )}
        
        {/* Owner controls */}
        {isOwnPost && (
          <IconButton onClick={handleMenuClick} sx={{ ml: 'auto' }}>
            <MoreVert />
          </IconButton>
        )}
      </CardActions>

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
    </Card>
    </div>
  );
};

export default PostCard;
