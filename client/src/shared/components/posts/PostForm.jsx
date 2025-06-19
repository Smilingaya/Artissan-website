import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, IconButton, Typography
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
    image: []
  });
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || initialData.title || '',
        caption: initialData.caption || initialData.content || '',
        image: []
      });

      const media = Array.isArray(initialData.media) ? initialData.media : [initialData.media];
      setPreviewUrls(media.filter(Boolean));
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, image: files }));
    setPreviewUrls(previews);
  };

  const handleRemovePreviews = () => {
    previewUrls.forEach(url => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    setFormData(prev => ({ ...prev, image: [] }));
    setPreviewUrls([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.caption.trim()) {
      alert('Please enter some content for your post');
      return;
    }

    if (type === 'edit') {
      onSubmit({ name: formData.name, caption: formData.caption });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle>{type === 'create' ? 'Create New Post' : 'Edit Post'}</DialogTitle>
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
            required
            sx={{ mb: 2 }}
          />

          {previewUrls.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {previewUrls.map((url, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <img
                    src={url}
                    alt={`preview-${index}`}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                  />
                </Box>
              ))}
              <IconButton onClick={handleRemovePreviews}>
                <Close />
              </IconButton>
            </Box>
          )}

          {type === 'create' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 2 }}>
              <IconButton color="primary" component="label" size="large">
                <input
                  hidden
                  accept="image/*,video/*"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
                <PhotoCamera sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                Click to add images or videos (max 5)
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {type === 'create' ? 'Create Post' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PostForm;
