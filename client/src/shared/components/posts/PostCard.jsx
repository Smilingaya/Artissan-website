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
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  MoreVert,
  Edit,
  Delete,
  Comment,
  Share,
} from '@mui/icons-material';

const PostCard = ({
  post,
  onLike,
  onEdit,
  onDelete,
  isOwnPost,
  onPostClick
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

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

  const mainMedia = Array.isArray(post.media) ? post.media[0] : post.media;
  const isVideo = mainMedia?.match(/\.(mp4|webm|ogg)$/i);

  return (
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
  );
};

export default PostCard;
