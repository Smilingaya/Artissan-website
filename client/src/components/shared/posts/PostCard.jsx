import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
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
  Share
} from '@mui/icons-material';

const PostCard = ({
  post,
  onLike,
  onPostClick,
  onEdit,
  onDelete,
  isOwnPost,
  showActions = true,
  variant = 'feed' // 'feed' or 'grid'
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleUserClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${post.user.id}`);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(post);
    handleMenuClose();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(post.id);
    handleMenuClose();
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLike?.(post.id);
  };

  if (variant === 'grid') {
    return (
      <Card 
        onClick={() => onPostClick?.(post)}
        sx={{ 
          height: '100%',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
          }
        }}
      >
        {post.imageUrl && (
          <CardMedia
            component="img"
            height="200"
            image={post.imageUrl}
            alt={post.title || 'Post image'}
            sx={{ objectFit: 'cover' }}
          />
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" component="div" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.content}
          </Typography>
        </CardContent>
        {showActions && (
          <CardActions disableSpacing>
            <IconButton onClick={handleLikeClick}>
              {post.isLiked ? <Favorite color="primary" /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {post.likes}
            </Typography>
            {isOwnPost && (
              <Box sx={{ marginLeft: 'auto' }}>
                <IconButton onClick={handleEdit}>
                  <Edit />
                </IconButton>
                <IconButton onClick={handleDelete}>
                  <Delete />
                </IconButton>
              </Box>
            )}
          </CardActions>
        )}
      </Card>
    );
  }

  return (
    <Card 
      onClick={() => onPostClick?.(post)}
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={post.user.avatar}
            alt={post.user.name}
            onClick={handleUserClick}
            sx={{ 
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
          />
        }
        action={
          isOwnPost && (
            <IconButton onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
          )
        }
        title={
          <Typography
            variant="subtitle2"
            component="span"
            onClick={handleUserClick}
            sx={{ 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {post.user.name}
          </Typography>
        }
        subheader={post.createdAt}
      />
      {post.imageUrl && (
        <CardMedia
          component="img"
          height="400"
          image={post.imageUrl}
          alt={post.title || 'Post image'}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent>
        {post.title && (
          <Typography variant="h6" gutterBottom>
            {post.title}
          </Typography>
        )}
        <Typography variant="body1">
          {post.content}
        </Typography>
      </CardContent>
      {showActions && (
        <CardActions disableSpacing>
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
        </CardActions>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default PostCard; 