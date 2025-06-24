import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, CircularProgress, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Block as BlockIcon, Delete as DeleteIcon, Warning as WarningIcon } from '@mui/icons-material';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import PostCard from '../../../shared/components/posts/PostCard';
import ProductCard from '../../../shared/components/products/ProductCard';
import PostDialog from '../../../shared/components/posts/PostDialog';
import ProductDialog from '../../../shared/components/products/ProductDialog';
import ProfileEdit from '../components/ProfileEdit';
import PostForm from '../../../shared/components/posts/PostForm';
import ProductForm from '../../../shared/components/products/ProductForm';
import UserListModal from '../../../shared/components/users/UserListModal';
import { standardizePostsArray } from '../../../shared/utils/dataTransformers';
import { 
  fetchUser, 
  fetchUserPosts, 
  fetchUserProducts, 
  fetchUserFollowers,
  fetchUserFollowing,
  deletePost,
  deleteProduct,
  updateProfile,
  followUser,
  unfollowUser,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
  createPost,
  updatePost,
  createProduct,
  updateProduct,
  blockUser
} from '../utils/api';
import { useAuth } from '../../../shared/contexts/UserContext';
import SideDrawer from '../../../shared/components/layout/SideDrawer';
import AccountSettings from '../components/AccountSettings';

const ProfilePage = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [error, setError] = useState(null);
  
  // Admin states
  const [isAdmin, setIsAdmin] = useState(false);
  const [blockDialog, setBlockDialog] = useState({ open: false, user: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null, type: '' });
  
  // Modal states
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [editPostOpen, setEditPostOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Check if current user is admin
        setIsAdmin(currentUser?.role === 'admin');
        
        // If no userId is provided in URL, redirect to current user's profile
        if (!userId && currentUser) {
          navigate(`/profile/${currentUser._id}`, { replace: true });
          return;
        }
        
        // If no userId and no currentUser, show error
        if (!userId && !currentUser) {
          setError('No user ID provided and no current user');
          setIsLoading(false);
          return;
        }
        
        // Use the userId from URL
        const targetUserId = userId;
        
        console.log('Loading profile data for user:', targetUserId);
        
        // Fetch user data first
        const userData = await fetchUser(targetUserId);
        console.log('User data received:', userData);
        
        if (!userData) {
          setError('User not found');
          setIsLoading(false);
          return;
        }
        const isFollowing = userData.followers?.includes(currentUser._id);

        setUser({
  ...userData,
  isFollowing: isFollowing || false
});
        
        // Check if viewing own profile
        setIsOwnProfile(currentUser && currentUser._id === targetUserId);
        
        // Fetch posts first
        console.log('Fetching posts for user:', targetUserId);
        const userPosts = await fetchUserPosts(targetUserId);
        console.log('Posts received:', userPosts);
        
        if (Array.isArray(userPosts)) {
          const standardizedPosts = standardizePostsArray(userPosts);
          console.log('Standardized posts:', standardizedPosts);
          const withLikeStatus = standardizedPosts.map(post => ({
            ...post,
            isLiked: Array.isArray(post.likes) && post.likes.includes(currentUser._id)
      }));
          setPosts(withLikeStatus);
        } else {
          console.error('Invalid posts data:', userPosts);
          setPosts([]);
        }
        
        // Fetch other data in parallel
        const [userProducts, userFollowers, userFollowing] = await Promise.all([
          fetchUserProducts(targetUserId),
          fetchUserFollowers(targetUserId),
          fetchUserFollowing(targetUserId)
        ]);
        
        // Ensure data is in the correct format
        const productsArray = Array.isArray(userProducts) ? userProducts : [];
        const followersArray = Array.isArray(userFollowers) ? userFollowers : [];
        const followingArray = Array.isArray(userFollowing) ? userFollowing : [];
        
        setProducts(productsArray);
        setFollowers(followersArray);
        setFollowing(followingArray);
        
      } catch (error) {
        console.error('Error loading profile data:', error);
        setError(`Failed to load profile data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only load data if we have a userId from URL
    if (userId) {
      loadData();
    } else if (currentUser) {
      // Redirect to current user's profile
      navigate(`/profile/${currentUser._id}`, { replace: true });
    } else {
      setError('No user ID provided and no current user');
      setIsLoading(false);
    }
  }, [userId, currentUser, navigate]);

  // Admin handlers
  const handleBlockUser = async (userId) => {
    try {
      const result = await blockUser(userId);
      setBlockDialog({ open: false, user: null });
      
      // Show success message with details
      alert(`User blocked successfully!\n\nDeleted content:\n- Posts: ${result.deletedContent.posts}\n- Products: ${result.deletedContent.products}\n- Comments: ${result.deletedContent.comments}\n- Orders: ${result.deletedContent.orders}`);
      
      // Navigate to admin blacklist
      navigate('/admin/blacklist');
    } catch (err) {
      console.error('Error blocking user:', err);
      setError(`Failed to block user: ${err.message}`);
    }
  };

  const handleDeleteAsAdmin = async (itemId, type) => {
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
        default:
          break;
      }
      setDeleteDialog({ open: false, item: null, type: '' });
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
    }
  };

  // Add a function to refresh posts
  const refreshPosts = async () => {
    if (!userId) return;
    try {
      console.log('Refreshing posts for user:', userId);
      const userPosts = await fetchUserPosts(userId);
      console.log('Refreshed posts:', userPosts);
      
      if (Array.isArray(userPosts)) {
        const standardizedPosts = standardizePostsArray(userPosts);
        console.log('Standardized refreshed posts:', standardizedPosts);
        setPosts(standardizedPosts);
      } else {
        console.error('Invalid refreshed posts data:', userPosts);
        setPosts([]);
      }
    } catch (error) {
      console.error('Error refreshing posts:', error);
      alert('Failed to refresh posts. Please try again.');
    }
  };

  // Update the post creation handler
  const handleCreatePost = async (formData) => {
    try {
      const response = await createPost({
        ...formData,
        userId: currentUser._id
      });
      
      if (response && response._id) {
        // Refresh the posts list after creating a new post
        await refreshPosts();
        setCreatePostOpen(false);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert(`Error creating post: ${error.message}`);
    }
  };

  const handleUpdatePost = async (postId, formData) => {
    try {
      const response = await updatePost(postId, formData);
      
      if (response && response._id) {
        // Refresh the posts list after updating
        await refreshPosts();
        setEditPostOpen(false);
        setSelectedPost(null);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert(`Error updating post: ${error.message}`);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        setPosts(prev => prev.filter(post => post._id !== postId));
        setSelectedPost(null);
      } catch (error) {
        console.error('Error deleting post:', error);
        alert(`Error deleting post: ${error.message}`);
      }
    }
  };

  const handleImageUpload = (event, callback) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => callback(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddPost = () => {
    setCreatePostOpen(true);
  };

  const handleAddProduct = () => {
    setCreateProductOpen(true);
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setEditPostOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setEditProductOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        setProducts(prev => prev.filter(product => product._id !== productId));
        setSelectedProduct(null);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(`Error deleting product: ${error.message}`);
      }
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      alert('Please log in to follow users');
      return;
    }

    if (!userId) {
      alert('No user ID available');
      return;
    }

    try {
      if (user.isFollowing) {
        await unfollowUser(userId);
        setUser(prev => ({ ...prev, isFollowing: false }));
        // Refresh followers count
        const updatedFollowers = await fetchUserFollowers(userId);
        const followersArray = Array.isArray(updatedFollowers) ? updatedFollowers : [];
        setFollowers(followersArray);
        // Update user state with new follower count
        setUser(prev => ({ ...prev, followers: followersArray }));
      } else {
        await followUser(userId);
        setUser(prev => ({ ...prev, isFollowing: true }));
        // Refresh followers count
        const updatedFollowers = await fetchUserFollowers(userId);
        const followersArray = Array.isArray(updatedFollowers) ? updatedFollowers : [];
        setFollowers(followersArray);
        // Update user state with new follower count
        setUser(prev => ({ ...prev, followers: followersArray }));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleLike = async (postId) => {
    if (!currentUser) {
      alert('Please log in to like posts');
      return;
    }

    try {
      const post = posts.find(p => p._id === postId);
      if (!post) return;

      if (post.isLiked) {
        await unlikePost(postId, currentUser._id);
        const updatedPost = { ...post, isLiked: false, likes: post.likes.filter(id => id !== currentUser._id) };
        setPosts(prev => prev.map(p => p._id === postId ? updatedPost : p));
        // Update selectedPost if it's the same post
        if (selectedPost && selectedPost._id === postId) {
          setSelectedPost(updatedPost);
        }
      } else {
        await likePost(postId, currentUser._id);
        const updatedPost = { ...post, isLiked: true, likes: [...(post.likes || []), currentUser._id] };
        setPosts(prev => prev.map(p => p._id === postId ? updatedPost : p));
        // Update selectedPost if it's the same post
        if (selectedPost && selectedPost._id === postId) {
          setSelectedPost(updatedPost);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    if (!currentUser) {
      alert('Please log in to comment');
      return;
    }

    try {
      await addComment(postId, { comment: commentText, user: currentUser._id });
      // Refresh the specific post to show the new comment
      const updatedPosts = await fetchUserPosts(userId);
      if (Array.isArray(updatedPosts)) {
        const standardizedPosts = standardizePostsArray(updatedPosts);
        const withLikeStatus = standardizedPosts.map(post => ({
          ...post,
          isLiked: Array.isArray(post.likes) && post.likes.includes(currentUser._id)
        }));
        setPosts(withLikeStatus);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await deleteComment(commentId, postId);
      // Refresh the specific post to show the updated comments
      const updatedPosts = await fetchUserPosts(userId);
      if (Array.isArray(updatedPosts)) {
        const standardizedPosts = standardizePostsArray(updatedPosts);
        const withLikeStatus = standardizedPosts.map(post => ({
          ...post,
          isLiked: Array.isArray(post.likes) && post.likes.includes(currentUser._id)
        }));
        setPosts(withLikeStatus);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleCreateProduct = async (formData) => {
    try {
      const response = await createProduct({
        ...formData,
        userId: currentUser._id
      });
      
      if (response && response._id) {
        // Refresh the products list after creating a new product
        await refreshProducts();
        setCreateProductOpen(false);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert(`Error creating product: ${error.message}`);
    }
  };

  const handleUpdateProduct = async (productId, formData) => {
    try {
      const response = await updateProduct(productId, formData);
      
      if (response && response._id) {
        // Refresh the products list after updating
        await refreshProducts();
        setEditProductOpen(false);
        setSelectedProduct(null);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert(`Error updating product: ${error.message}`);
    }
  };

  const refreshProducts = async () => {
    if (!userId) return;
    try {
      const userProducts = await fetchUserProducts(userId);
      const productsArray = Array.isArray(userProducts) ? userProducts : [];
      setProducts(productsArray);
    } catch (error) {
      console.error('Error refreshing products:', error);
      alert('Failed to refresh products. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>User not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <SideDrawer open={true} />
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <ProfileHeader
            user={user}
            isOwnProfile={isOwnProfile}
            onEditProfile={() => setEditProfileOpen(true)}
            onFollowToggle={handleFollowToggle}
            postsCount={posts.length}
            productsCount={products.length}
            followersCount={followers.length}
            followingCount={following.length}
            onShowFollowers={() => setShowFollowers(true)}
            onShowFollowing={() => setShowFollowing(true)}
          />

          {/* Admin Controls */}
          {isAdmin && !isOwnProfile && (
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'warning.light' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'warning.dark' }}>
                Admin Controls
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<BlockIcon />}
                  onClick={() => setBlockDialog({ open: true, user: user })}
                >
                  Block User
                </Button>
              </Box>
            </Paper>
          )}

          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            {isOwnProfile ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setAccountSettingsOpen(true)}
                >
                  Account Settings
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setCreatePostOpen(true)}
                >
                  Add Post
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setCreateProductOpen(true)}
                >
                  Add Product
                </Button>
              </Box>
            ) : null}
          </Box>

          <ProfileTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          
          {/* Posts Section */}
          {activeTab === 'posts' && (
            <Box sx={{ 
              display: viewMode === 'grid' ? 'grid' : 'flex',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'none',
              flexDirection: viewMode === 'grid' ? 'unset' : 'column',
              gap: 2
            }}>
              {posts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={handleLike}
                  onPostClick={setSelectedPost}
                  onEdit={handleEditPost}
                  onDelete={isAdmin ? () => setDeleteDialog({ open: true, item: post, type: 'post' }) : handleDeletePost}
                  isOwnPost={isOwnProfile}
                  variant={viewMode === 'grid' ? 'grid' : 'feed'}
                />
              ))}
            </Box>
          )}

          {/* Products Section */}
          {activeTab === 'products' && (
            <Box sx={{ 
              display: viewMode === 'grid' ? 'grid' : 'flex',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'none',
              flexDirection: viewMode === 'grid' ? 'unset' : 'column',
              gap: 2
            }}>
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onProductClick={setSelectedProduct} // opens ProductDialog
                  onEdit={handleEditProduct}
                  onDelete={isAdmin ? () => setDeleteDialog({ open: true, item: product, type: 'product' }) : handleDeleteProduct}
                  isOwnProduct={isOwnProfile}
                  variant={viewMode === 'grid' ? 'grid' : 'list'}
                />

              ))}
            </Box>
          )}

          {/* Modals */}
          {selectedPost && (
            <PostDialog 
              post={selectedPost}
              open={!!selectedPost}
              onClose={() => setSelectedPost(null)}
              onLike={handleLike}
              onEdit={handleEditPost}
              onDelete={isAdmin ? () => setDeleteDialog({ open: true, item: selectedPost, type: 'post' }) : handleDeletePost}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              isOwnPost={isOwnProfile}
              currentUser={currentUser}
            />
          )}

          {selectedProduct && (
            <ProductDialog
              product={selectedProduct}
              open={Boolean(selectedProduct)}
              onClose={() => setSelectedProduct(null)}
              isOwnProduct={isOwnProfile}
              currentUser={currentUser} 
            />

          )}

          {editProfileOpen && (
            <ProfileEdit 
              user={user}
              open={editProfileOpen}
              onClose={() => setEditProfileOpen(false)}
              onSave={async (updatedData) => {
                try {
                  console.log('Updating profile for user:', userId);
                  const response = await updateProfile(userId, updatedData);

                  if (response && response.user) {
                    // Update the user state with the new data
                    setUser(response.user);
                  } else {
                    // If the response doesn't include the user data, fetch it
                    const refreshedUser = await fetchUser(userId);
                    setUser(refreshedUser);
                  }

                  setEditProfileOpen(false);
                } catch (error) {
                  console.error('Error updating profile:', error);
                  alert(`Error updating profile: ${error.message}`);
                }
              }}
            />
          )}

          {(createPostOpen || editPostOpen) && (
            <PostForm
  open={createPostOpen || editPostOpen}
  onClose={() => {
    setCreatePostOpen(false);
    setEditPostOpen(false);
    setSelectedPost(null);
  }}
  type={createPostOpen ? 'create' : 'edit'}
  initialData={selectedPost}
  onSubmit={
    createPostOpen
      ? handleCreatePost
      : (formData) => handleUpdatePost(selectedPost?._id, formData)
  }
/>

          )}

          {(createProductOpen || editProductOpen) && (
            <ProductForm 
              open={createProductOpen || editProductOpen}
              onClose={() => {
                setCreateProductOpen(false);
                setEditProductOpen(false);
                setSelectedProduct(null);
              }}
              type={createProductOpen ? 'create' : 'edit'}
              initialData={selectedProduct}
              onSubmit={
  createProductOpen
    ? handleCreateProduct
    : (formData) => handleUpdateProduct(selectedProduct?._id, formData)
}

            />
          )}

          <UserListModal
            open={showFollowers}
            onClose={() => setShowFollowers(false)}
            title={`Followers (${followers.length})`}
            users={followers}
          />

          <UserListModal
            open={showFollowing}
            onClose={() => setShowFollowing(false)}
            title={`Following (${following.length})`}
            users={following}
          />

          {accountSettingsOpen && (
            <AccountSettings
              open={accountSettingsOpen}
              onClose={() => setAccountSettingsOpen(false)}
              userId={userId}
            />
          )}

          {/* Admin Dialogs */}
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
                onClick={() => handleBlockUser(userId)}
              >
                Block User
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, item: null, type: '' })}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon color="error" />
              Confirm Delete (Admin)
            </DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this {deleteDialog.type} as an admin? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialog({ open: false, item: null, type: '' })}>
                Cancel
              </Button>
              <Button
                color="error"
                onClick={() => handleDeleteAsAdmin(deleteDialog.item?._id, deleteDialog.type)}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default ProfilePage;