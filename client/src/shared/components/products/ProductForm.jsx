import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, IconButton, Typography,
  InputAdornment, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import { fetchCategoriesHomePage } from '../../../features/profile/utils/api';

const ProductForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  type = 'create',
  initialData = null
}) => {
  const [formData, setFormData] = useState({
  name: initialData?.name || '',
  description: initialData?.description || initialData?.discreption || '',
  price: initialData?.price ?? '',
  stoke: initialData?.stoke ?? '',
  categoryId: initialData?.category?._id || initialData?.category || '',
  mainImage: initialData?.mainImage || ''
});


  const [categories, setCategories] = useState([]);

  // ✅ Load categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await fetchCategoriesHomePage();
        setCategories(result);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, mainImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, mainImage: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.stoke || !formData.categoryId || !formData.mainImage) {
      alert('Please fill in all required fields.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{type === 'create' ? 'Create New Product' : 'Edit Product'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            required
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Stock"
              name="stoke"
              type="number"
              value={formData.stoke}
              onChange={handleChange}
              required
              sx={{ flex: 1 }}
            />
          </Box>

          {/* ✅ Category Select Dropdown */}
          <FormControl fullWidth required sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                categoryId: e.target.value
              }))}
              required
              fullWidth
            >
              {categories.map(category => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>

          </FormControl>

          {/* ✅ Image Preview or Upload */}
          {formData.mainImage ? (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <img
                src={formData.mainImage}
                alt="Product"
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
                  backgroundColor: 'background.paper'
                }}
              >
                <Close />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
              <IconButton color="primary" component="label" size="large">
                <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                <PhotoCamera sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="caption" color="text.secondary">Click to add a product image</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {type === 'create' ? 'Create Product' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;
