import React from 'react';
import { List, Typography, Box } from '@mui/material';
import CommentItem from './CommentItem';

const CommentList = ({ comments, onDeleteComment }) => {
  if (!comments || comments.length === 0) {
    return (
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No comments yet. Be the first to comment!
        </Typography>
      </Box>
    );
  }
  
  return (
    <List disablePadding>
      {comments.map(comment => (
        <CommentItem 
          key={comment._id} 
          comment={comment} 
          onDelete={() => onDeleteComment(comment._id)} 
        />
      ))}
    </List>
  );
};

export default CommentList; 