import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Avatar,
  CardMedia,
  Divider,
  Button,
  Chip,
  Rating,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { Close, ShoppingCart, Star, Send } from '@mui/icons-material';
import { UserContext } from '../../../contexts/UserContext';
import { OrderContext } from '../../../contexts/OrderContext';
import { useNavigate } from 'react-router-dom';

const ProductDialog = ({ product, open, onClose, isOwnProduct }) => {
  const { currentUser } = useContext(UserContext);
  const { createOrder } = useContext(OrderContext);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [error, setError] = useState('');

  useEffect(() => {
    // Ensure reviews is always an array
    setReviews(Array.isArray(product?.reviews) ? product.reviews : []);
  }, [product]);

  if (!product) return null;

  const handleAddReview = () => {
    if (!newReview.trim()) return;
    
    const newReviewObj = {
      id: Date.now(),
      text: newReview,
      rating: newRating,
      user: {
        name: 'Current User',
        avatar: 'https://i.pravatar.cc/300',
      },
      timestamp: 'Just now'
    };

    setReviews(prevReviews => [...prevReviews, newReviewObj]);
    setNewReview('');
    setNewRating(5);
  };

  const handleCreateOrder = () => {
    try {
      const orderData = {
        items: [{
          id: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.mainImage
        }],
        total: product.price * quantity,
        userId: currentUser?.id || 1, // Using 1 as default for mock data
        sellerId: product.user?._id || 2, // Using 2 as default for mock data
        status: 'pending',
        paymentStatus: 'unpaid'
      };

      const newOrder = createOrder(orderData);
      onClose();
      navigate('/my-orders');
    } catch (err) {
      setError('Failed to create order');
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 'No ratings yet';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={product.user?.avatar}
          alt={product.user?.name}
          sx={{ width: 40, height: 40 }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
            {product.user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.category}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, p: 3 }}>
          <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '50%' } }}>
            <CardMedia
              component="img"
              image={product.mainImage}
              alt={product.name}
              sx={{ 
                width: '100%',
                borderRadius: 2,
                aspectRatio: '1',
                objectFit: 'cover'
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={Number(averageRating) || 0} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({averageRating})
              </Typography>
            </Box>
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price.toFixed(2)}
            </Typography>
            <Box sx={{ my: 2 }}>
              <Chip 
                label={`Stock: ${product.stoke}`}
                color="info"
                sx={{ mr: 1 }}
              />
              <Chip 
                label={product.category}
                variant="outlined"
              />
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {product.discreption}
            </Typography>

            {!isOwnProduct && (
              <Box sx={{ mb: 3 }}>
                {error && (
                  <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                  InputProps={{ inputProps: { min: 1, max: product.stoke } }}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleCreateOrder}
                  disabled={product.stoke === 0}
                  fullWidth
                >
                  {product.stoke > 0 ? 'Order Now' : 'Out of Stock'}
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  You'll enter shipping details during checkout
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Reviews Section */}
            <Typography variant="h6" gutterBottom>
              Reviews ({reviews.length})
            </Typography>

            <List sx={{ mb: 2 }}>
              {reviews.map((review) => (
                <ListItem key={review.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar src={review.user.avatar} alt={review.user.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2">
                          {review.user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.timestamp}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Rating value={review.rating} size="small" readOnly sx={{ mt: 0.5 }} />
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {review.text}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {/* Add Review Section */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Add Your Review
              </Typography>
              <Rating
                value={newRating}
                onChange={(event, newValue) => {
                  setNewRating(newValue || 5);
                }}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Write your review..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  multiline
                  rows={2}
                />
                <IconButton 
                  color="primary"
                  onClick={handleAddReview}
                  disabled={!newReview.trim()}
                  sx={{ alignSelf: 'flex-end' }}
                >
                  <Send />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog; 