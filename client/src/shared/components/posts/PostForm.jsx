import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, IconButton, Typography,
  Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import { useAuth } from '../../contexts/UserContext';
import { fetchUserProducts } from '../../../features/profile/utils/api';

const PostForm = ({ open, onClose, onSubmit, type = 'create', initialData = null }) => {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    caption: '',
    image: [],
    productIds: [],
  });

  const [userProducts, setUserProducts] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [mediaLimitMsg, setMediaLimitMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        caption: initialData.caption || '',
        image: [],
        productIds: initialData.productLinks?.map(p => p._id) || [],
      });
      const media = Array.isArray(initialData.media) ? initialData.media : [initialData.media];
      setPreviewUrls(media.filter(Boolean));
    }
  }, [initialData]);

  useEffect(() => {
    if (!open || !currentUser?._id) return;
    const loadProducts = async () => {
      try {
        const products = await fetchUserProducts(currentUser._id);
        setUserProducts(products);
      } catch (error) {
        console.error('Failed to fetch user products:', error);
      }
    };
    loadProducts();
  }, [open, currentUser]);

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => url.startsWith('blob:') && URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({ ...prev, productIds: typeof value === 'string' ? value.split(',') : value }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const totalMedia = formData.image.length + files.length;
    if (totalMedia > 5) {
      setMediaLimitMsg('❌ Maximum of 5 media files allowed.');
      return;
    }
    const previews = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, image: [...prev.image, ...files] }));
    setPreviewUrls(prev => [...prev, ...previews]);
    setMediaLimitMsg('');
  };

  const handleRemoveMedia = (index) => {
    const removed = previewUrls[index];
    setFormData(prev => {
      const updated = [...prev.image];
      updated.splice(index, 1);
      return { ...prev, image: updated };
    });
    setPreviewUrls(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    if (removed.startsWith('blob:')) setTimeout(() => URL.revokeObjectURL(removed), 100);
    setMediaLimitMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('Please enter a name for your post');
    if (type === 'edit') {
      onSubmit({ name: formData.name, caption: formData.caption });
    } else {
      onSubmit({
        name: formData.name,
        caption: formData.caption,
        image: formData.image,
        productLinks: formData.productIds,
        userId: currentUser._id,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{type === 'create' ? 'Create New Post' : 'Edit Post'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Title"
            required
            fullWidth
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            name="caption"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={formData.caption}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          {type === 'create' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Product(s)</InputLabel>
              <Select
                multiple
                name="productIds"
                value={formData.productIds}
                label="Select Product(s)"
                onChange={handleProductChange}
              >
                {userProducts.length > 0 ? (
                  userProducts.map(product => (
                    <MenuItem key={product._id} value={product._id}>
                      {product.name} - DA {product.price}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No products found</MenuItem>
                )}
              </Select>
            </FormControl>
          )}

          {previewUrls.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {previewUrls.map((url, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <img
                    src={url}
                    alt={`preview-${index}`}
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveMedia(index)}
                    sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white', boxShadow: 1 }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          {type === 'create' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 2 }}>
              <IconButton color="primary" component="label" size="large">
                <input hidden accept="image/*,video/*" type="file" multiple onChange={handleImageChange} />
                <PhotoCamera sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                Click to add images or videos (max 5)
              </Typography>
              {mediaLimitMsg && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {mediaLimitMsg}
                </Typography>
              )}
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
