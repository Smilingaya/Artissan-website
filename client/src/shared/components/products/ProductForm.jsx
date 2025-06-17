import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  InputAdornment
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';

const ProductForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  type = 'create',
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    stoke: initialData?.stoke || '',
    category: initialData?.category || '',
    mainImage: initialData?.mainImage || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'description' ? { discreption: value } : {}),
      ...(name === 'discreption' ? { description: value } : {})
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          mainImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name) {
      alert('Product name is required');
      return;
    }
    if (!formData.description) {
      alert('Product description is required');
      return;
    }
    if (!formData.price) {
      alert('Product price is required');
      return;
    }
    if (!formData.stoke && formData.stoke !== 0) {
      alert('Product stock is required');
      return;
    }
    if (!formData.category) {
      alert('Product category is required');
      return;
    }
    if (!formData.mainImage) {
      alert('Product image is required');
      return;
    }

    onSubmit(formData);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      mainImage: ''
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
        {type === 'create' ? 'Create New Product' : 'Edit Product'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Product Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
            required
          />
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              margin="dense"
              name="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              variant="outlined"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ flex: 1 }}
            />
            <TextField
              margin="dense"
              name="stoke"
              label="Stock"
              type="number"
              value={formData.stoke}
              onChange={handleChange}
              variant="outlined"
              required
              sx={{ flex: 1 }}
            />
          </Box>
          <TextField
            margin="dense"
            name="category"
            label="Category"
            type="text"
            fullWidth
            value={formData.category}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
            required
          />
          
          {formData.mainImage ? (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <img
                src={formData.mainImage}
                alt="Product preview"
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
                Click to add a product image
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
            {type === 'create' ? 'Create Product' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm; 