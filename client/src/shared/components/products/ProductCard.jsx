import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Button,
  Chip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Edit,
  Delete,
  Favorite,
  FavoriteBorder,
  MoreVert,
  ShoppingCart
} from '@mui/icons-material';

const ProductCard = ({
  product,
  onProductClick,
  onUserClick,
  onEdit,
  onDelete,
  onCreateOrder,
  isOwnProduct,
  variant = 'grid' // 'grid' or 'list'
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleUserClick = (e) => {
    e.stopPropagation();
    if (onUserClick) {
      onUserClick(product.user._id);
    } else {
      navigate(`/profile/${product.user._id}`);
    }
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(product);
    handleMenuClose();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(product._id);
    handleMenuClose();
  };

  const handleOrderClick = (e) => {
    e.stopPropagation();
    onCreateOrder?.(product._id);
  };

  if (variant === 'list') {
    return (
      <Card
        onClick={() => onProductClick?.(product)}
        sx={{
          display: 'flex',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 200, objectFit: 'cover' }}
          image={product.mainImage}
          alt={product.name}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar
                src={product.user?.avatar}
                alt={product.user?.name}
                sx={{ width: 24, height: 24, mr: 1 }}
                onClick={handleUserClick}
              />
              <Typography
                variant="subtitle2"
                component="span"
                onClick={handleUserClick}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {product.user?.name}
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {product.discreption}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" color="primary">
                ${product.price.toFixed(2)}
              </Typography>
              <Chip 
                label={`Stock: ${product.stoke}`}
                size="small"
                color="info"
                sx={{ ml: 'auto' }}
              />
            </Box>
          </CardContent>
          <CardActions sx={{ mt: 'auto', justifyContent: 'flex-end' }}>
            {isOwnProduct ? (
              <>
                <IconButton onClick={handleEdit}>
                  <Edit />
                </IconButton>
                <IconButton onClick={handleDelete}>
                  <Delete />
                </IconButton>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<ShoppingCart />}
                onClick={handleOrderClick}
                disabled={product.stoke <= 0}
              >
                {product.stoke > 0 ? 'Order Now' : 'Out of Stock'}
              </Button>
            )}
          </CardActions>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      onClick={() => onProductClick?.(product)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={product.user?.avatar}
            alt={product.user?.name}
            onClick={handleUserClick}
            sx={{ cursor: 'pointer' }}
          />
        }
        title={
          <Typography
            variant="subtitle2"
            component="span"
            onClick={handleUserClick}
            sx={{ 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {product.user?.name}
          </Typography>
        }
        subheader={product.category}
      />
      <CardMedia
        component="img"
        height={variant === 'grid' ? '200' : '300'}
        image={product.mainImage}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.discreption}
        </Typography>
        <Typography variant="h6" color="primary">
          ${product.price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Chip 
          label={`Stock: ${product.stoke}`}
          size="small"
          color="info"
        />
        {isOwnProduct ? (
          <Box>
            <IconButton onClick={handleEdit}>
              <Edit />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <Delete />
            </IconButton>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<ShoppingCart />}
            onClick={handleOrderClick}
            disabled={product.stoke <= 0}
          >
            {product.stoke > 0 ? 'Order' : 'Out of Stock'}
          </Button>
        )}
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default ProductCard; 