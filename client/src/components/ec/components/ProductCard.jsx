import React, { useContext } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Rating, 
  Button,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <Card sx={{ maxWidth: 345, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
      <CardMedia
        component="img"
        height="240"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component={Link} to={`/product/${product.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
          {product.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviews})
          </Typography>
        </Box>
        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
          ${product.price}
        </Typography>
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ mt: 2 }} 
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;