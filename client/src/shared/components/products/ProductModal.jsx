import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Rating,
  Avatar,
  Divider,
  Menu,
  MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDistanceToNow } from 'date-fns';

const ProductModal = ({ product, open, onClose, isOwnProduct, user, onEdit, onDelete }) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (onEdit) onEdit(product);
  };

  const handleDelete = () => {
    handleMenuClose();
    if (onDelete) onDelete(product._id);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!review.trim() || !rating) return;
    
    // Implement review submission with API call
    setReview('');
    setRating(0);
  };

  if (!product) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', height: '90vh' }}>
          {/* Image Section */}
          <Box sx={{ flex: 1, bgcolor: 'black', display: 'flex', alignItems: 'center' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>

          {/* Content Section */}
          <Box sx={{ width: 400, display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={user.profilePicture} alt={user.name}>
                  {user.name.charAt(0)}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="medium">
                  {user.name}
                </Typography>
              </Box>
              <Box>
                {isOwnProduct && (
                  <IconButton onClick={handleMenuOpen}>
                    <MoreVertIcon />
                  </IconButton>
                )}
                <IconButton onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            
            <Divider />

            {/* Product Details */}
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                ${product.price.toFixed(2)}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Rating value={product.rating} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({product.reviews?.length || 0} reviews)
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {product.stock} left in stock
              </Typography>
            </Box>

            <Divider />

            {/* Reviews Section */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Reviews
              </Typography>

              {(product.reviews || []).length > 0 ? (
                (product.reviews || []).map((review) => (
                  <Box key={review.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Avatar 
                        src={review.user.profilePicture} 
                        alt={review.user.name}
                        sx={{ width: 32, height: 32 }}
                      >
                        {review.user.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">
                            {review.user.name}
                          </Typography>
                          <Rating value={review.rating} size="small" readOnly />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
                          {review.text}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 5 }}>
                          {formatDistanceToNow(new Date(review.timestamp), { addSuffix: true })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No reviews yet
                </Typography>
              )}
            </Box>

            <Divider />

            {/* Add Review Section */}
            {!isOwnProduct && (
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Add a Review
                </Typography>
                <form onSubmit={handleReviewSubmit}>
                  <Box sx={{ mb: 2 }}>
                    <Rating
                      value={rating}
                      onChange={(event, newValue) => {
                        setRating(newValue);
                      }}
                      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Write your review..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      multiline
                      rows={2}
                    />
                    <Button 
                      type="submit"
                      variant="contained"
                      disabled={!review.trim() || !rating}
                    >
                      Submit
                    </Button>
                  </Box>
                </form>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      {/* Product Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>
    </Dialog>
  );
};

export default ProductModal; 