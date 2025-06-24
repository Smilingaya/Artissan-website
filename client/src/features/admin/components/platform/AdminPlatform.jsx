import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Avatar,
  Card,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Block as BlockIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../shared/contexts/UserContext';
import { 
  fetchAllPosts, 
  fetchAllProducts, 
  deletePost, 
  deleteProduct,
  deleteComment,
  addCategory,
  blockUser
} from '../../../profile/utils/api';

const AdminPlatform = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null, type: '' });
  const [blockDialog, setBlockDialog] = useState({ open: false, user: null });

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated || !currentUser || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, currentUser, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsData, productsData] = await Promise.all([
        fetchAllPosts(),
        fetchAllProducts()
      ]);
      setPosts(postsData);
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load platform data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId, type) => {
    try {
      switch (type) {
        case 'post':
          await deletePost(itemId);
          setPosts(prev => prev.filter(post => post._id !== itemId));
          break;
        case 'product':
          await deleteProduct(itemId);
          setProducts(prev => prev.filter(product => product._id !== itemId));
          break;
        case 'comment':
          // You'll need to implement deleteComment in your API
          // await deleteComment(itemId);
          break;
        default:
          break;
      }
      setDeleteDialog({ open: false, item: null, type: '' });
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await blockUser(userId);
      setBlockDialog({ open: false, user: null });
      // Refresh data after blocking
      fetchData();
    } catch (err) {
      console.error('Error blocking user:', err);
      setError('Failed to block user');
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const filteredPosts = posts.filter(post =>
    post.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading platform data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Platform Overview (Admin View)
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search posts, products, or users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Posts Section */}
      <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
        All Posts ({filteredPosts.length})
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {filteredPosts.map((post) => (
          <Grid item xs={12} md={6} lg={4} key={post._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {post.media && post.media.length > 0 && (
                <Box sx={{ height: 200, width: '100%', overflow: 'hidden' }}>
                  {post.media[0].match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={post.media[0]}
                      controls
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      component="img"
                      src={post.media[0]}
                      alt={post.name}
                      sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    />
                  )}
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar
                    src={post.user?.profilePicture}
                    sx={{ mr: 1, cursor: 'pointer' }}
                    onClick={() => handleViewProfile(post.user?._id)}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => handleViewProfile(post.user?._id)}
                  >
                    {post.user?.name || 'Unknown User'}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {post.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {post.caption}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={`${post.likes?.length || 0} likes`} size="small" />
                  <Chip label={`${post.comments?.length || 0} comments`} size="small" />
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button
                  size="small"
                  startIcon={<PersonIcon />}
                  onClick={() => handleViewProfile(post.user?._id)}
                >
                  View Profile
                </Button>
                <Box>
                  <IconButton
                    size="small"
                    color="warning"
                    onClick={() => setBlockDialog({ open: true, user: post.user })}
                  >
                    <BlockIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialog({ open: true, item: post, type: 'post' })}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Products Section */}
      <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
        All Products ({filteredProducts.length})
      </Typography>
      <Grid container spacing={2}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} md={6} lg={4} key={product._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {product.mainImage && (
                <Box
                  component="img"
                  src={product.mainImage}
                  alt={product.name}
                  sx={{ height: 200, width: '100%', objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar
                    src={product.user?.profilePicture}
                    sx={{ mr: 1, cursor: 'pointer' }}
                    onClick={() => handleViewProfile(product.user?._id)}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => handleViewProfile(product.user?._id)}
                  >
                    {product.user?.name || 'Unknown User'}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  ${product.price}
                </Typography>
                <Chip label={`Stock: ${product.stock || 0}`} size="small" />
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button
                  size="small"
                  startIcon={<PersonIcon />}
                  onClick={() => handleViewProfile(product.user?._id)}
                >
                  View Profile
                </Button>
                <Box>
                  <IconButton
                    size="small"
                    color="warning"
                    onClick={() => setBlockDialog({ open: true, user: product.user })}
                  >
                    <BlockIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialog({ open: true, item: product, type: 'product' })}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, item: null, type: '' })}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteDialog.type}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, item: null, type: '' })}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={() => handleDelete(deleteDialog.item?._id, deleteDialog.type)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block User Dialog */}
      <Dialog open={blockDialog.open} onClose={() => setBlockDialog({ open: false, user: null })}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BlockIcon color="warning" />
          Block User
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to block {blockDialog.user?.name}? They will be added to the blacklist.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialog({ open: false, user: null })}>
            Cancel
          </Button>
          <Button
            color="warning"
            onClick={() => handleBlockUser(blockDialog.user?._id)}
          >
            Block User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPlatform; 