import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const UpdatePostDialog = ({ open, onClose, post }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // Set initial state only if post is available
  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setDescription(post.description || '');
      setImage(post.image || '');
    }
  }, [post]);

  const handleUpdatePost = () => {
    // Update post logic (e.g., call API to update the post)
    onClose();
  };

  if (!post) {
    return null; // Return null or a loading state if the post is not available
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Post</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Image URL"
          fullWidth
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdatePost} color="primary">Update Post</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePostDialog;
