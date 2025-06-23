import React, { useState, useEffect, useRef } from 'react';
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
import { Close, ShoppingCart, Send, ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../../features/profile/utils/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const ProductDialog = ({ product, open, onClose, isOwnProduct, currentUser }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Swiper refs for navigation
  const mainSwiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    setReviews(Array.isArray(product?.reviews) ? product.reviews : []);
    console.log('Product id:', product?._id);
  }, [product]);

  // Get all product images
  const getAllImages = () => {
    const images = [];
    if (product?.mainImage) {
      images.push(product.mainImage);
    }
    if (Array.isArray(product?.multipleFiles)) {
      images.push(...product.multipleFiles);
    }
    return images;
  };

  const productImages = getAllImages();

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
        src={product.user?.profilePicture || '/default-avatar.png'}
        alt={product.user?.name || 'Unknown User'}
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
        {product.user?.name || 'Unknown User'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {typeof product.category === 'string' ? product.category : product.category?.name || 'No category'}
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

  <DialogContent sx={{ p: 0, height: '80vh' }}>
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      
      {/* Left: Fixed Image Section */}
      <Box sx={{ width: '50%', p: 2, flexShrink: 0 }}>
        {/* Main Swiper */}
        <Box sx={{ position: 'relative', mb: 2 , height: productImages.length > 1 ? '300px' : '100%'}}>
          <Swiper
            ref={mainSwiperRef}
            modules={[Navigation, Thumbs]}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper }}
            spaceBetween={0}
            slidesPerView={1}
            style={{ 
              height: productImages.length > 1 ? '300px' : '100%',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
            onSwiper={setMainSwiper}
          >
            {productImages.map((imageUrl, index) => (
              <SwiperSlide key={index}>
                <img
                  src={imageUrl}
                  alt={`${product.name} - ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    margin: '0 auto',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* Thumbnails */}
        {productImages.length > 1 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              All Images ({productImages.length})
            </Typography>
            <Swiper
              ref={thumbsSwiperRef}
              modules={[Navigation, Thumbs]}
              spaceBetween={8}
              slidesPerView={4}
              watchSlidesProgress={true}
              style={{ height: '80px' }}
              onSwiper={setThumbsSwiper}
            >
              {productImages.map((imageUrl, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={imageUrl}
                    alt={`${product.name} - ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 8,
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      transition: 'border-color 0.3s ease'
                    }}
                    onClick={() => mainSwiper?.slideTo(index)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        )}
      </Box>

      {/* Right: Scrollable Details Section */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <Typography variant="h4" gutterBottom>
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Rating value={Number(averageRating) || 0} precision={0.1} readOnly />
          <Typography variant="body2" color="text.secondary">
            ({averageRating})
          </Typography>
        </Box>

        <Typography variant="h5" color="primary" gutterBottom>
          DA {product.price.toFixed(2)}
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
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              InputProps={{ inputProps: { min: 1, max: product.stoke } }}
              sx={{ mb: 2 }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<ShoppingCart />}
              onClick={handleCreateOrder}
              disabled={product.stoke <= 0 || quantity > product.stoke}
              sx={{ mb: 1 }}
            >
              {product.stoke > 0 
                ? `Order Now - DA ${(product.price * quantity).toFixed(2)}`
                : 'Out of Stock'
              }
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Reviews ({reviews.length})
        </Typography>

        {!isOwnProduct && (
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Write a review..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Rating
                value={newRating}
                onChange={(e, value) => setNewRating(value)}
                size="small"
              />
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddReview}
                disabled={!newReview.trim()}
                startIcon={<Send />}
              >
                Add Review
              </Button>
            </Box>
          </Box>
        )}

        <List sx={{ maxHeight: 200, overflow: 'auto' }}>
          {reviews.map((review, index) => (
            <ListItem key={review.id || index} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar src={review.user?.avatar} alt={review.user?.name} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2">
                      {review.user?.name}
                    </Typography>
                    <Rating value={review.rating} size="small" readOnly />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                      {review.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.timestamp}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
          {reviews.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              No reviews yet. Be the first to review this product!
            </Typography>
          )}
        </List>
      </Box>
    </Box>
  </DialogContent>
</Dialog>

  );
};

export default ProductDialog;