import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';

const CommentForm = ({ value, onChange, onSubmit }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Add a comment..."
        variant="outlined"
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        sx={{ mr: 1 }}
        multiline
        maxRows={3}
      />
      <IconButton 
        color="primary" 
        onClick={onSubmit}
        disabled={!value.trim()}
      >
        <Send />
      </IconButton>
    </Box>
  );
};

export default CommentForm; 