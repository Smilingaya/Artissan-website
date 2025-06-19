import React, { useState, useEffect } from 'react';
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
import { Close, ShoppingCart, Send } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../../features/profile/utils/api';

const ProductDialog = ({ product, open, onClose, isOwnProduct, currentUser }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setReviews(Array.isArray(product?.reviews) ? product.reviews : []);
  }, [product]);

  if (!product) return null;

  const handleUserClick = () => {
  if (product.user && typeof product.user === 'object' && product.user._id) {
    navigate(`/profile/${product.user._id}`);
  }
};

  const handleAddReview = () => {
    if (!newReview.trim()) return;

    const newReviewObj = {
      id: Date.now(),
      text: newReview,
      rating: newRating,
      user: {
        name: currentUser?.name || 'User',
        avatar: currentUser?.profilePicture || '',
      },
      timestamp: 'Just now',
    };

    setReviews(prev => [...prev, newReviewObj]);
    setNewReview('');
    setNewRating(5);
  };

  const handleCreateOrder = async () => {
  try {
    if (!product || !product.user || !product.user._id || !currentUser?._id) {
      setError('Missing user information');
      return;
    }

    const orderData = {
      userId: currentUser._id,
      items: [
        {
          product: product._id,
          quantity: quantity,
        }
      ],
      shippingAddress: 'Temporary Address Placeholder',
      phoneNumber: 1234567890
    };

    console.log('Creating order with data:', orderData);
    console.log('Artisan ID:', product.user._id);

    const result = await createOrder(product.user._id, orderData);

    setSuccessMessage('✅ Order created successfully!');
    
    // Optional: wait a moment before closing and navigating
    setTimeout(() => {
      onClose();
      navigate('/my-orders');
    }, 1500);
  } catch (err) {
    setError(err.message || 'Failed to create order');
    console.error('Failed to create order:', err);
  }
};



  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 'No ratings yet';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, maxHeight: '90vh' } }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
         <IconButton onClick={handleUserClick} sx={{ p: 0 }}>
          <Avatar
            src={product.user?.profilePicture || ''}
            alt={product.user?.name || 'User'}
            sx={{ width: 40, height: 40 }}
          />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: 600, cursor: 'pointer' }}
            onClick={handleUserClick}
          >
            {product.user?.name || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.category?.name || 'No category'}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
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
              sx={{ width: '100%', borderRadius: 2, aspectRatio: '1', objectFit: 'cover' }}
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
              <Chip label={`Stock: ${product.stoke}`} color="info" sx={{ mr: 1 }} />
              <Chip label={product.category?.name || 'No category'} variant="outlined" />
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
                {successMessage && (
  <Typography color="success.main" variant="body2" sx={{ mb: 2 }}>
    {successMessage}
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">{review.user.name}</Typography>
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

            {/* Add Review */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Add Your Review
              </Typography>
              <Rating
                value={newRating}
                onChange={(e, val) => setNewRating(val || 5)}
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
