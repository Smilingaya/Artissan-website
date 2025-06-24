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
  MoreVert,
  ShoppingCart,
  Block as BlockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/UserContext';

const ProductCard = ({
  product,
  onProductClick,   // Called when clicking the product card
  onUserClick,
  onEdit,
  onDelete,
  isOwnProduct,
  variant = 'grid',
  onOrder,
  onBlockUser,
  onViewProfile
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleUserClick = (e) => {
    e.stopPropagation();
    if (onViewProfile) {
      onViewProfile(product.user._id);
    } else if (onUserClick) {
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

  const handleBlockUser = (e) => {
    e.stopPropagation();
    onBlockUser?.(product.user);
    handleMenuClose();
  };

  const handleCardClick = () => {
    onProductClick?.(product); // This opens ProductDialog from pf.jsx
  };

  if (variant === 'list') {
    return (
      <Card
        onClick={handleCardClick}
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
                src={product.user?.profilePicture }
                alt={product.user?.name}
                sx={{ width: 24, height: 24, mr: 1, cursor: 'pointer' }}
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
                DA {product.price.toFixed(2)}
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
            ) : isAdmin ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={handleUserClick}
                  title="View Profile"
                >
                  <PersonIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="warning"
                  onClick={handleBlockUser}
                  title="Block User"
                >
                  <BlockIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={handleDelete}
                  title="Delete Product (Admin)"
                >
                  <Delete />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<ShoppingCart />}
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
      onClick={handleCardClick}
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
      <CardMedia
        component="img"
        height="400"
        image={product.mainImage}
        alt={product.name}
        sx={{
              maxHeight: '100%',
              width: '100%',
              objectFit: 'cover',
            }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={product.user?.profilePicture}
            sx={{ mr: 1, cursor: 'pointer' }}
            onClick={handleUserClick}
          />
          <Typography
            variant="subtitle2"
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={handleUserClick}
          >
            {product.user?.name || 'Unknown User'}
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.discreption}
        </Typography>
        <Typography variant="h6" color="primary">
          DA {product.price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Chip
          label={`Stock: ${product.stoke}`}
          size="small"
          color="info"
        />
        {isOwnProduct ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handleEdit}>
              <Edit />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <Delete />
            </IconButton>
          </Box>
        ) : isAdmin ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              color="primary"
              onClick={handleUserClick}
              title="View Profile"
            >
              <PersonIcon />
            </IconButton>
            <IconButton
              size="small"
              color="warning"
              onClick={handleBlockUser}
              title="Block User"
            >
              <BlockIcon />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={handleDelete}
              title="Delete Product (Admin)"
            >
              <Delete />
            </IconButton>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<ShoppingCart />}
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
