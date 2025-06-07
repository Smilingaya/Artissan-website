import React, { useState, useContext } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Rating, 
  Button, 
  FormControl, 
  Select, 
  MenuItem, 
  InputLabel 
} from '@mui/material';
import { CartContext } from '../contexts/CartContext';

const ProductDetail = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const { addToCart } = useContext(CartContext);

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart({...product, selectedSize});
    } else {
      alert('Please select a size');
    }
  };

  if (!product) return <Typography>Product not found</Typography>;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ width: '20%', mr: 2 }}>
            {product.gallery && product.gallery.map((img, index) => (
              <Box 
                key={index} 
                component="img" 
                src={img} 
                alt={`${product.name} view ${index+1}`}
                sx={{ 
                  width: '100%', 
                  height: 'auto', 
                  mb: 1, 
                  cursor: 'pointer',
                  border: '1px solid #e0e0e0'
                }}
              />
            ))}
          </Box>
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{ 
              width: '80%', 
              height: 'auto',
              border: '1px solid #e0e0e0'
            }}
          />
        </Box>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Typography variant="h5" component="h1" gutterBottom>
          {product.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={product.rating} readOnly />
          <Typography variant="body2" sx={{ ml: 1 }}>
            ({product.reviews})
          </Typography>
        </Box>
        
        <Typography variant="h4" component="p" sx={{ mb: 3 }}>
          ${product.price}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          {product.description}
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select Size
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {product.sizes.map(size => (
              <Button 
                key={size} 
                variant={selectedSize === size ? "contained" : "outlined"}
                onClick={() => setSelectedSize(size)}
                sx={{ minWidth: '48px' }}
              >
                {size}
              </Button>
            ))}
          </Box>
        </Box>
        
        <Button 
          variant="contained" 
          size="large" 
          fullWidth 
          onClick={handleAddToCart}
          sx={{ mb: 2 }}
        >
          ADD TO CART
        </Button>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            SKU: {product.sku}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Cash on delivery is available on this product.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Easy returns and exchange policy within 7 days.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProductDetail;