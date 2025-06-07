import React from 'react';
import PropTypes from 'prop-types';
import { 
  Grid, 
  Box, 
  Card, 
  CardMedia, 
  Typography, 
  Rating,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton
} from '@mui/material';
import { 
  ShoppingBag,
  MoreVert,
  Edit,
  Delete
} from '@mui/icons-material';

const ProductGrid = ({ products, onProductClick, isOwnProfile, onEdit, onDelete }) => (
  <Grid container spacing={3}>
    {products.map(product => (
      <Grid item xs={12} sm={6} md={4} key={product._id}>
        <Card 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            backgroundColor: 'background.paper',
            "&:hover": {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
            }
          }}
          onClick={() => onProductClick(product)}
        >
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="200"
              image={product.mainImage}
              alt={product.name}
              sx={{ 
                objectFit: 'cover',
                borderRadius: '16px 16px 0 0'
              }}
            />
            {isOwnProfile && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'flex',
                  gap: 1,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 2,
                  padding: '4px',
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(product);
                  }}
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(product._id);
                  }}
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'error.main' }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
          <Box sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom
              sx={{ 
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'text.primary',
                mb: 1,
                height: '2.4em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {product.name}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                mb: 2,
                height: '3em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {product.discreption}
            </Typography>
            <Box sx={{ 
              mt: 'auto', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography 
                variant="h6" 
                color="primary"
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1.25rem'
                }}
              >
                ${product.price.toFixed(2)}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'info.main',
                  backgroundColor: 'info.light',
                  padding: '4px 12px',
                  borderRadius: 4,
                  fontWeight: 500
                }}
              >
                Stock: {product.stoke}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Grid>
    ))}
  </Grid>
);

const ProductList = ({ products, onProductClick, isOwnProfile, onEdit, onDelete }) => (
  <List sx={{ 
    bgcolor: 'background.paper', 
    borderRadius: 2, 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden'
  }}>
    {products.map(product => (
      <ListItem 
        key={product._id}
        onClick={() => onProductClick(product)}
        sx={{ 
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.02)',
          },
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 2
        }}
      >
        <ListItemAvatar>
          <Avatar 
            variant="rounded"
            src={product.mainImage} 
            alt={product.name}
            sx={{ 
              width: 100, 
              height: 100, 
              mr: 2,
              borderRadius: 2
            }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography 
              variant="subtitle1" 
              component="div" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.5
              }}
            >
              {product.name}
            </Typography>
          }
          secondary={
            <Box component="div">
              <Typography 
                component="div" 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 1 }}
              >
                {product.discreption}
              </Typography>
              <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography 
                  component="span" 
                  variant="subtitle2" 
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  ${product.price.toFixed(2)}
                </Typography>
                <Typography 
                  component="span" 
                  variant="body2"
                  sx={{ 
                    color: 'info.main',
                    backgroundColor: 'info.light',
                    padding: '4px 12px',
                    borderRadius: 4,
                    fontWeight: 500
                  }}
                >
                  Stock: {product.stoke}
                </Typography>
              </Box>
            </Box>
          }
        />
        {isOwnProfile && (
          <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              edge="end" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <Edit />
            </IconButton>
            <IconButton 
              edge="end" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product._id);
              }}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: 'error.main' }
              }}
            >
              <Delete />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    ))}
  </List>
);

const ProfileShop = ({ products = [], onProductClick, viewMode = 'grid', isOwnProfile, onEdit, onDelete }) => {
  if (!products || products.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 5,
        color: 'text.secondary'
      }}>
        <Typography variant="h6" gutterBottom>
          No products yet
        </Typography>
        <Typography variant="body2">
          When you add products to your shop, they will appear here.
        </Typography>
      </Box>
    );
  }

  return viewMode === 'grid' ? (
    <ProductGrid 
      products={products} 
      onProductClick={onProductClick}
      isOwnProfile={isOwnProfile}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  ) : (
    <ProductList 
      products={products} 
      onProductClick={onProductClick}
      isOwnProfile={isOwnProfile}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

ProfileShop.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      discreption: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      mainImage: PropTypes.string.isRequired,
      stoke: PropTypes.number.isRequired
    })
  ),
  onProductClick: PropTypes.func.isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list']),
  isOwnProfile: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default ProfileShop;