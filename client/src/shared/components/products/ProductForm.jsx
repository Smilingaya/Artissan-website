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
    mainImage: initialData?.mainImage || '',
    multipleFiles: []
  });

  const [previewUrls, setPreviewUrls] = useState([]);
  const [categories, setCategories] = useState([]);

  // ✅ Load categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await fetchCategoriesHomePage();
        setCategories(result);
        console.log("Fetched categories:", result);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Handle initial data for edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || initialData.discreption || '',
        price: initialData.price ?? '',
        stoke: initialData.stoke ?? '',
        categoryId: initialData.category?._id || initialData.category || '',
        mainImage: initialData.mainImage || '',
        multipleFiles: []
      });

      // Set preview URLs for existing images
      const existingImages = [];
      if (initialData.mainImage) {
        existingImages.push(initialData.mainImage);
      }
      if (Array.isArray(initialData.multipleFiles)) {
        existingImages.push(...initialData.multipleFiles);
      }
      setPreviewUrls(existingImages);
    }
  }, [initialData]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMainImageChange = (event) => {
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

  const handleMultipleImagesChange = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      alert('Please select only image files');
      return;
    }

    const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Some images are larger than 5MB. Please resize them.');
      return;
    }

    const currentCount = previewUrls.length - (formData.mainImage ? 1 : 0);
    if (currentCount + imageFiles.length > 5) {
      alert('Maximum 5 additional images allowed');
      return;
    }

    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({ 
      ...prev, 
      multipleFiles: [...prev.multipleFiles, ...imageFiles] 
    }));
  };

  const handleRemoveMainImage = () => {
    setFormData(prev => ({ ...prev, mainImage: '' }));
    setPreviewUrls(prev => prev.filter((_, index) => index !== 0));
  };

  const handleRemoveMultipleImage = (index) => {
    const actualIndex = formData.mainImage ? index + 1 : index;
    const urlToRemove = previewUrls[actualIndex];
    
    if (urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove);
    }
    
    setPreviewUrls(prev => prev.filter((_, i) => i !== actualIndex));
    setFormData(prev => ({
      ...prev,
      multipleFiles: prev.multipleFiles.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveAllImages = () => {
    previewUrls.forEach(url => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    setFormData(prev => ({ 
      ...prev, 
      mainImage: '', 
      multipleFiles: [] 
    }));
    setPreviewUrls([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.stoke || !formData.categoryId || !formData.mainImage) {
      alert('Please fill in all required fields including main image.');
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
              InputProps={{ startAdornment: <InputAdornment position="start">DA</InputAdornment> }}
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
          {categories.length === 0 ? (
  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
    Loading categories...
  </Typography>
) : (
  <FormControl fullWidth required sx={{ mb: 2 }}>
    <InputLabel>Category</InputLabel>
    <Select
      label="Category"
      value={formData.categoryId}
      onChange={(e) =>
        setFormData(prev => ({ ...prev, categoryId: e.target.value }))
      }
    >
      {categories.map(category => (
        <MenuItem key={category._id} value={category._id}>
          {category.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)}


          {/* Main Image Section */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Main Image (Required)
          </Typography>
          
          {formData.mainImage ? (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <img
                src={formData.mainImage}
                alt="Main Product"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
              <IconButton
                onClick={handleRemoveMainImage}
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, mb: 2, border: '2px dashed', borderColor: 'grey.300', borderRadius: 2 }}>
              <IconButton color="primary" component="label" size="large">
                <input hidden accept="image/*" type="file" onChange={handleMainImageChange} />
                <PhotoCamera sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="caption" color="text.secondary">Click to add main product image</Typography>
            </Box>
          )}

          {/* Additional Images Section */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Additional Images (Optional - Max 5)
          </Typography>
          
          {previewUrls.length > (formData.mainImage ? 1 : 0) && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {previewUrls.slice(formData.mainImage ? 1 : 0).map((url, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <img
                    src={url}
                    alt={`additional-${index}`}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                  />
                  <IconButton 
                    onClick={() => handleRemoveMultipleImage(index)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'background.paper',
                      width: 24,
                      height: 24
                    }}
                  >
                    <Close sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              ))}
              <IconButton onClick={handleRemoveAllImages} sx={{ alignSelf: 'flex-start' }}>
                <Close />
              </IconButton>
            </Box>
          )}

          {previewUrls.length < (formData.mainImage ? 6 : 5) && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, border: '2px dashed', borderColor: 'grey.300', borderRadius: 2 }}>
              <IconButton color="primary" component="label" size="large">
                <input 
                  hidden 
                  accept="image/*" 
                  type="file" 
                  multiple
                  onChange={handleMultipleImagesChange} 
                />
                <PhotoCamera sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                Click to add additional images (max {formData.mainImage ? 5 : 5})
              </Typography>
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
