import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, CircularProgress, Typography, Paper, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileTabs from '../components/Profile/ProfileTabs';
import PostCard from '../components/shared/posts/PostCard';
import ProductCard from '../components/shared/products/ProductCard';
import PostDialog from '../components/shared/posts/PostDialog';
import ProductDialog from '../components/shared/products/ProductDialog';
import ProfileEdit from '../components/Profile/ProfileEdit';
import PostForm from '../components/shared/posts/PostForm';
import ProductForm from '../components/shared/products/ProductForm';
import UserListModal from '../components/shared/users/UserListModal';
import { standardizePostsArray } from '../utils/dataTransformers';
import { 
  fetchUser, 
  fetchUserPosts, 
  fetchUserProducts, 
  fetchAllUsers,
  deletePost,
  deleteProduct,
  updateProfile
} from '../components/Profile/utils/api';
import AppHeader from '../components/HP/layout/AppHeader';
import SideDrawer from '../components/HP/layout/SideDrawer';

const ProfilePage = () => {
  const { userId } = useParams();
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [error, setError] = useState(null);
  
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
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch user data first
        const userData = await fetchUser(userId);
        if (!userData) {
          setError('User not found');
          setIsLoading(false);
          return;
        }
        setUser(userData);
        
        // Only fetch posts and products if we have valid user data
        const [userPosts, userProducts, allUsers] = await Promise.all([
          fetchUserPosts(userId),
          fetchUserProducts(userId),
          fetchAllUsers()
        ]);
        
        // Standardize posts data structure
        setPosts(standardizePostsArray(userPosts));
        setProducts(userProducts);
        
        // Set followers and following from all users
        const userFollowers = allUsers.filter(u => !u.isOwner).slice(0, userData.followers);
        const userFollowing = allUsers.filter(u => !u.isOwner).slice(0, userData.following);
        setFollowers(userFollowers);
        setFollowing(userFollowing);
        
        // Check if viewing own profile
        setIsOwnProfile(userData.isOwner);
      } catch (error) {
        console.error('Error loading profile data:', error);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      loadData();
    }
  }, [userId]);

  const handleImageUpload = (event, callback) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
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

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
      setSelectedPost(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter(product => product._id !== productId));
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (user) {
      setUser({
        ...user,
        isFollowing: !user.isFollowing,
        followers: user.isFollowing ? user.followers - 1 : user.followers + 1
      });
    }
  };

  const handleLike = async (postId) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            {error || 'User not found'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The user you're looking for doesn't exist or has been removed.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <SideDrawer open={true} />
      
      <Box sx={{ 
        flexGrow: 1,
        paddingLeft: { xs: 0, sm: '96px' },
        paddingTop: '64px',
        transition: 'padding-left 0.3s ease'
      }}>
        <AppHeader />
        <Container maxWidth="md">
          <ProfileHeader 
            user={user}
            isOwnProfile={isOwnProfile}
            onEditProfile={() => setEditProfileOpen(true)}
            onFollowToggle={handleFollowToggle}
            postsCount={posts.length}
            productsCount={products.length}
            onShowFollowers={() => setShowFollowers(true)}
            onShowFollowing={() => setShowFollowing(true)}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
            {isOwnProfile && (
              <>
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
              </>
            )}
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
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onPostClick={setSelectedPost}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
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
                  onProductClick={setSelectedProduct}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
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
              onDelete={handleDeletePost}
              isOwnPost={isOwnProfile}
            />
          )}

          {selectedProduct && (
            <ProductDialog 
              product={selectedProduct}
              open={!!selectedProduct}
              onClose={() => setSelectedProduct(null)}
              isOwnProduct={isOwnProfile}
            />
          )}

          {editProfileOpen && (
            <ProfileEdit 
              user={user}
              open={editProfileOpen}
              onClose={() => setEditProfileOpen(false)}
              onSave={async (updatedData) => {
                try {
                  const updatedUser = await updateProfile(user._id, updatedData);
                  setUser(updatedUser);
                  setEditProfileOpen(false);
                } catch (error) {
                  console.error('Error updating profile:', error);
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
              onSubmit={async (updatedData) => {
                try {
                  // Here you would make the API call to update the post
                  const updatedPost = { ...selectedPost, ...updatedData };
                  setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
                  setEditPostOpen(false);
                  setSelectedPost(null);
                } catch (error) {
                  console.error('Error updating post:', error);
                }
              }}
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
              onSubmit={async (updatedData) => {
                try {
                  // Here you would make the API call to update the product
                  const updatedProduct = { ...selectedProduct, ...updatedData };
                  setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
                  setEditProductOpen(false);
                  setSelectedProduct(null);
                } catch (error) {
                  console.error('Error updating product:', error);
                }
              }}
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
        </Container>
      </Box>
    </Box>
  );
};

export default ProfilePage;