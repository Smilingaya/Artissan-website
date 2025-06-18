import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, CircularProgress, Typography, Paper, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
  updateProduct
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
        setUser(userData);
        
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
      alert(error.message || 'Failed to create post. Please try again.');
    }
  };

  // Update the post update handler
  const handleUpdatePost = async (postId, formData) => {
  try {
    const updatedPost = await updatePost(postId, {
      name: formData.name,
      caption: formData.caption
    });

    const oldPost = posts.find(p => p._id === postId);

    if (oldPost) {
      updatedPost.user = oldPost.user;
    }

    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
    setEditPostOpen(false);
    setSelectedPost(null);
  } catch (error) {
    console.error('Error updating post:', error);
    alert(error.message || 'Failed to update post. Please try again.');
  }
};


  // Update the post deletion handler
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      // Refresh the posts list after deletion
      await refreshPosts();
      setSelectedPost(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error.message || 'Failed to delete post. Please try again.');
    }
  };

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
    if (!user || !currentUser) return;
    
    try {
      if (user.isFollowing) {
        await unfollowUser(user._id);
        setUser({
          ...user,
          isFollowing: false,
          followers: user.followers - 1
        });
      } else {
        await followUser(user._id);
        setUser({
          ...user,
          isFollowing: true,
          followers: user.followers + 1
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleLike = async (postId) => {
  try {
    const updatedPost = posts.find(p => p._id === postId);
    const alreadyLiked = updatedPost.likes.includes(currentUser._id);

    const data = alreadyLiked
      ? await unlikePost(postId, currentUser._id)
      : await likePost(postId, currentUser._id);

    const newPost = {
      ...updatedPost,
      likes: data.post.likes,
      isLiked: !alreadyLiked
    };

    // تحديث البوست في القائمة
    setPosts(prev => prev.map(p => p._id === postId ? newPost : p));

    // إذا كنت تستخدم selectedPost لعرض التفاصيل:
    if (selectedPost && selectedPost._id === postId) {
      setSelectedPost(newPost);
    }
  } catch (error) {
    console.error('Error toggling like:', error);
  }
};

const handleAddComment = async (postId, commentText) => {
    try {
      const newComment = await addComment(postId, { text: commentText });
      setPosts(prevPosts => prevPosts.map(post => 
        post._id === postId 
          ? { ...post, comments: [...(post.comments || []), newComment] }
          : post
      ));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await deleteComment(commentId);
      setPosts(prevPosts => prevPosts.map(post => 
        post._id === postId 
          ? { ...post, comments: post.comments.filter(c => c._id !== commentId) }
          : post
      ));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };


  // PATCH: Robust product creation handler
  const handleCreateProduct = async (formData) => {
    try {
      // Ensure we have a valid user ID
      if (!currentUser?._id) {
        throw new Error('User not authenticated');
      }

      // Log the form data for debugging
      console.log('Submitting product form data:', {
        ...formData,
        userId: currentUser._id
      });

      const response = await createProduct({
        ...formData,
        userId: currentUser._id
      });

      if (response && response._id) {
        // Refresh the products list after creating a new product
        await refreshProducts();
        setCreateProductOpen(false);
        // Show success message
        alert('Product created successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      // Show user-friendly error message
      alert(error.message || 'Failed to save product. Please try again.');
    }
  };

  // PATCH: Add refreshProducts function
  const refreshProducts = async () => {
    if (!userId) return;
    try {
      const userProducts = await fetchUserProducts(userId);
      setProducts(Array.isArray(userProducts) ? userProducts : []);
    } catch (error) {
      console.error('Error refreshing products:', error);
      alert('Failed to refresh products. Please try again.');
    }
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
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {error?.includes('401') || error?.includes('Unauthorized') 
              ? 'Please log in to view this profile.'
              : error?.includes('404') || error?.includes('not found')
              ? 'The user you\'re looking for doesn\'t exist or has been removed.'
              : 'Failed to load profile data. Please try again later.'
            }
          </Typography>
          {!currentUser && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => window.location.href = '/login'}
              sx={{ mr: 1 }}
            >
              Log In
            </Button>
          )}
          <Button 
            variant="outlined" 
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </Button>
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
        <Container maxWidth="md">
          <ProfileHeader 
           key={user._id + user.name + user.bio}
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
                  key={post._id}
                  post={post}
                  onLike={handleLike}
                  onPostClick={setSelectedPost}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
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
              onSubmit={handleCreateProduct}
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
        </Container>
      </Box>
    </Box>
  );
};

export default ProfilePage;