import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';

const PostForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  type = 'create',
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    name: '',
    caption: '',
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || initialData.title || '',
        caption: initialData.caption || initialData.content || '',
        image: initialData.images?.[0] || initialData.media || null
      });
      setPreviewUrl(initialData.images?.[0] || initialData.media || '');
    }
  }, [initialData]);

  useEffect(() => {
    // Cleanup preview URL when component unmounts or when image changes
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Cleanup previous preview URL if it exists
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Create new preview URL
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.caption.trim()) {
      alert('Please enter some content for your post');
      return;
    }
    onSubmit(formData);
  };

  const handleRemoveImage = () => {
    // Cleanup preview URL if it exists
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle>
        {type === 'create' ? 'Create New Post' : 'Edit Post'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Title (optional)"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="caption"
            label="Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={formData.caption}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
            required
          />
          
          {previewUrl ? (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <img
                src={previewUrl}
                alt="Post preview"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'background.paper',
                  '&:hover': { backgroundColor: 'background.paper' }
                }}
              >
                <Close />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 1,
              py: 2
            }}>
              <IconButton
                color="primary"
                component="label"
                size="large"
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                />
                <PhotoCamera sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                Click to add an image
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained"
            color="primary"
          >
            {type === 'create' ? 'Create Post' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PostForm; 