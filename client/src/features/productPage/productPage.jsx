// src/pages/ProductPage.jsx

import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct, createOrder } from '../../features/profile/utils/api';
import { useAuth } from '../../shared/contexts/UserContext';

import {
  Box, Dialog, DialogContent, DialogTitle, IconButton, Typography,
  Avatar, Divider, Button, Chip, Rating, TextField, List,
  ListItem, ListItemAvatar, ListItemText, CircularProgress
} from '@mui/material';
import {
  Close, ShoppingCart, Send
} from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const ProductPage = () => {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const mainSwiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProduct(id);
        setProduct(data);
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      } catch (err) {
        console.error(err);
      }
    };
    loadProduct();
  }, [id]);

  const getAllImages = () => {
    const images = [];
    if (product?.mainImage) images.push(product.mainImage);
    if (Array.isArray(product?.multipleFiles)) images.push(...product.multipleFiles);
    return images;
  };

  const handleUserClick = () => {
    if (product?.user?._id) navigate(`/profile/${product.user._id}`);
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
      timestamp: 'Just now'
    };
    setReviews(prev => [...prev, newReviewObj]);
    setNewReview('');
    setNewRating(5);
  };

  const handleCreateOrder = async () => {
    if (!product || !product.user || !product.user._id || !currentUser?._id) {
      setError('Missing user information');
      return;
    }

    const orderData = {
      userId: currentUser._id,
      items: [{ product: product._id, quantity }],
      shippingAddress: 'Temporary Address Placeholder',
      phoneNumber: 1234567890
    };

    try {
      await createOrder(product.user._id, orderData);
      setSuccessMessage('✅ Order created successfully!');
      setTimeout(() => navigate('/my-orders'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to create order');
    }
  };

  const productImages = getAllImages();
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'No ratings yet';

  if (!product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Dialog open fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 2, maxHeight: '90vh' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={handleUserClick}>
          <Avatar src={product.user?.profilePicture} />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography onClick={handleUserClick} sx={{ fontWeight: 600, cursor: 'pointer' }}>
            {product.user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.category?.name}
          </Typography>
        </Box>
        <IconButton onClick={() => navigate(-1)}>
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 0, height: '80vh' }}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          <Box sx={{ width: '50%', p: 2 }}>
            <Swiper
              ref={mainSwiperRef}
              modules={[Navigation, Thumbs]}
              navigation
              thumbs={{ swiper: thumbsSwiper }}
              onSwiper={setMainSwiper}
              slidesPerView={1}
              style={{ borderRadius: '8px', height: productImages.length > 1 ? '300px' : '100%' }}
            >
              {productImages.map((url, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={url}
                    alt={`product-${i}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {productImages.length > 1 && (
              <Swiper
                ref={thumbsSwiperRef}
                modules={[Navigation, Thumbs]}
                slidesPerView={4}
                onSwiper={setThumbsSwiper}
                spaceBetween={8}
                style={{ height: 80, marginTop: 8 }}
              >
                {productImages.map((url, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={url}
                      alt={`thumb-${i}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 8,
                        cursor: 'pointer'
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Box>

          <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
            <Typography variant="h4">{product.name}</Typography>
            <Rating value={Number(averageRating)} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary">
              ({averageRating})
            </Typography>
            <Typography variant="h5" color="primary">
              DA {product.price.toFixed(2)}
            </Typography>
            <Chip label={`Stock: ${product.stoke}`} sx={{ mr: 1 }} />
            <Chip label={product.category?.name || 'No category'} variant="outlined" />
            <Typography sx={{ mt: 2 }}>{product.discreption}</Typography>

            <Box sx={{ mt: 2 }}>
              {error && <Typography color="error">{error}</Typography>}
              {successMessage && <Typography color="success.main">{successMessage}</Typography>}
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                fullWidth
                sx={{ my: 1 }}
              />
              <Button
                startIcon={<ShoppingCart />}
                fullWidth
                variant="contained"
                disabled={product.stoke <= 0 || quantity > product.stoke}
                onClick={handleCreateOrder}
              >
                {product.stoke > 0
                  ? `Order Now - DA ${(product.price * quantity).toFixed(2)}`
                  : 'Out of Stock'}
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Reviews ({reviews.length})</Typography>
            <TextField
              multiline
              rows={2}
              placeholder="Write a review..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating value={newRating} onChange={(e, value) => setNewRating(value)} />
              <Button variant="outlined" size="small" onClick={handleAddReview} startIcon={<Send />}>
                Add Review
              </Button>
            </Box>

            <List>
              {reviews.map((review, i) => (
                <ListItem key={i} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar src={review.user?.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">{review.user?.name}</Typography>
                        <Rating value={review.rating} size="small" readOnly />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">{review.text}</Typography>
                        <Typography variant="caption" color="text.secondary">{review.timestamp}</Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
              {reviews.length === 0 && (
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                  No reviews yet.
                </Typography>
              )}
            </List>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPage;
