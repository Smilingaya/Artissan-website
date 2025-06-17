import React from 'react';
import { List, Typography, Box, ListItem, ListItemAvatar, ListItemText, IconButton } from '@mui/material';
import CommentItem from './CommentItem';
import { Delete } from '@mui/icons-material';
import { Avatar } from '@mui/material';

const CommentList = ({ comments, onDeleteComment, isOwnComment }) => {
  if (!Array.isArray(comments) || comments.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No comments yet
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {comments.map((comment) => (
        <ListItem key={comment._id} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar 
              src={comment.user?.avatar || comment.userAvatar} 
              alt={comment.user?.name || 'User'} 
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">
                  {comment.user?.name || 'User'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {comment.timestamp || comment.createdAt}
                  </Typography>
                  {isOwnComment && (
                    <IconButton 
                      size="small" 
                      onClick={() => onDeleteComment?.(comment._id)}
                      sx={{ p: 0.5 }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            }
            secondary={comment.text}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default CommentList; 