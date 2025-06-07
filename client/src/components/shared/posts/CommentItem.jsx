import React, { useState } from 'react';
import { 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  IconButton, 
  Menu,
  MenuItem
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { formatDate } from '../../../utils/formatters';

const CommentItem = ({ comment, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isOwnComment = comment.user._id === '1'; // Assuming logged-in user ID is '1'
  
  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleDelete = () => {
    onDelete();
    handleMenuClose();
  };

  return (
    <ListItem 
      alignItems="flex-start"
      secondaryAction={
        <IconButton edge="end" onClick={handleMenuOpen} size="small">
          <MoreVert fontSize="small" />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar src={comment.user.avatar} alt={comment.user.username} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle2" component="span">
            {comment.user.username}
          </Typography>
        }
        secondary={
          <>
            <Typography variant="body2" component="span" color="text.primary">
              {comment.text}
            </Typography>
            <Typography variant="caption" component="p" color="text.secondary">
              {formatDate(comment.createdAt)}
            </Typography>
          </>
        }
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {isOwnComment && (
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        )}
        <MenuItem onClick={handleMenuClose}>Report</MenuItem>
      </Menu>
    </ListItem>
  );
};

export default CommentItem; 