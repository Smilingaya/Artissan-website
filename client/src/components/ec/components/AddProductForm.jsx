import React, { useState, useContext } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Grid
} from '@mui/material';
import { ProductContext } from '../contexts/ProductContext';

const AddProductForm = ({ product = null, onClose }) => {
  const { addProduct, updateProduct } = useContext(ProductContext);
  const [sizes, setSizes] = useState(product ? product.sizes : ['S', 'M', 'L', 'XL']);
  const [newSize, setNewSize] = useState('');
  
  const [formData, setFormData] = useState({
    id: product ? product.id : Date.now(),
    name: product ? product.name : '',
    price: product ? product.price : '',
    description: product ? product.description : '',
    category: product ? product.category : '',
    image: product ? product.image : 'https://via.placeholder.com/300x400',
    rating: product ? product.rating : 4,
    reviews: product ? product.reviews : 0,
    sku: product ? product.sku : `SKU-${Date.now()}`,
    gallery: product ? product.gallery : []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' ? parseFloat(value) : value });
  };

  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setSizes(sizes.filter(size => size !== sizeToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      sizes
    };
    
    if (product) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    
    if (onClose) onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {product ? 'Edit Product' : 'Add New Product'}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            margin="normal"
            InputProps={{ startAdornment: '$' }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Sizes
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {sizes.map((size) => (
              <Chip
                key={size}
                label={size}
                onDelete={() => handleRemoveSize(size)}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Add Size"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              size="small"
            />
            <Button 
              variant="outlined" 
              onClick={handleAddSize}
            >
              Add
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        {onClose && (
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained">
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddProductForm;