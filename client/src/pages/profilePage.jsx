/*import React, { useEffect, useState } from 'react';
import { Box, Container, CircularProgress } from '@mui/material';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileTabs from '../components/Profile/ProfileTabs';
import FollowersModal from '../components/Profile/FollowersModal';
import FollowingModal from '../components/Profile/FollowingModal';
import ProductModal from '../components/Profile/ProductModal';
import PostPopup from '../components/Profile/PostPopup';
import EditProfileDialog from '../components/Profile/EditProfileDialog';
import SettingsMenu from '../components/Profile/SettingsMenu';
import AddPostDialog from '../components/Profile/AddPostDialog';
import UpdatePostDialog from '../components/Profile/UpdatePostDialog';
//import { fetchUserData } from '../utils/fetchUserData';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addPostOpen, setAddPostOpen] = useState(false);
  const [updatePostOpen, setUpdatePostOpen] = useState(false);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);

  useEffect(() => {
  // Static user data simulation
  setUser({
    _id: '1',
    username: 'johndoe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Passionate artisan crafting beauty from everyday materials.',
    followers: [
      { _id: '2', username: 'alice', avatar: 'https://i.pravatar.cc/150?img=2', isFollowing: true },
      { _id: '3', username: 'bob', avatar: 'https://i.pravatar.cc/150?img=3', isFollowing: false },
      { _id: '4', username: 'charlie', avatar: 'https://i.pravatar.cc/150?img=4', isFollowing: true },
    ],
    following: [
      { _id: '5', username: 'david', avatar: 'https://i.pravatar.cc/150?img=5' },
      { _id: '6', username: 'eve', avatar: 'https://i.pravatar.cc/150?img=6' },
    ],
    posts: [
      {
        _id: '101',
        title: 'Sunset Painting',
        image: 'https://source.unsplash.com/random/400x400?art',
        description: 'An impressionist painting of a warm sunset.',
        comments: [
          { _id: 'c1', author: 'alice', text: 'Beautiful work!' },
          { _id: 'c2', author: 'bob', text: 'Love the colors.' },
        ],
      },
      {
        _id: '102',
        title: 'Handcrafted Vase',
        image: 'https://source.unsplash.com/random/400x400?ceramic',
        description: 'A ceramic vase with traditional patterns.',
        comments: [],
      },
    ],
    products: [
      {
        _id: '201',
        title: 'Wool Scarf',
        image: 'https://source.unsplash.com/random/400x400?scarf',
        description: 'Soft and warm, made from 100% organic wool.',
      },
      {
        _id: '202',
        title: 'Leather Wallet',
        image: 'https://source.unsplash.com/random/400x400?wallet',
        description: 'Durable and stylish handcrafted wallet.',
      },
    ],
  });
}, []);

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <ProfileHeader
        user={user}
        onEditProfile={() => setEditProfileOpen(true)}
        onShowFollowers={() => setShowFollowers(true)}
        onShowFollowing={() => setShowFollowing(true)}
        onOpenSettings={(e) => setSettingsAnchorEl(e.currentTarget)}
      />
      <ProfileTabs
        user={user}
        onSelectPost={setSelectedPost}
        onSelectProduct={setSelectedProduct}
        onAddPost={() => setAddPostOpen(true)}
        onUpdatePost={() => setUpdatePostOpen(true)}
      />

      <FollowersModal open={showFollowers} onClose={() => setShowFollowers(false)} followers={user.followers} />
      <FollowingModal open={showFollowing} onClose={() => setShowFollowing(false)} following={user.following} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <PostPopup post={selectedPost} onClose={() => setSelectedPost(null)} />
      <EditProfileDialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)} user={user} />
      <AddPostDialog open={addPostOpen} onClose={() => setAddPostOpen(false)} />
      <UpdatePostDialog open={updatePostOpen} onClose={() => setUpdatePostOpen(false)} post={selectedPost} />
      <SettingsMenu anchorEl={settingsAnchorEl} onClose={() => setSettingsAnchorEl(null)} />
    </Container>
  );
};

export default ProfilePage;
*/

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import post1 from '../assets/post1.jpg';
import post2 from '../assets/post2.jpg';
import profile from '../assets/profile.jpg';


// Mock data for demonstration
const users = [
  {
    _id: '1',
    username: 'Ines',
    fullName: 'Ines Rodriguez',
    bio: 'Digital artist and designer | Creating art that inspires',
    website: 'www.inesdesigns.com',
    avatar: profile,
    followers: 1432,
    following: 351,
    isFollowing: false,
    isPrivate: false,
    email: 'ines@example.com',
    phone: '+1234567890',
    gender: 'Female',
    birthday: '1992-05-15',
  },
  {
    _id: '2',
    username: 'Aya',
    fullName: 'Aya Williams',
    bio: 'Food blogger and cake designer',
    website: 'www.ayacreations.com',
    avatar: post1,
    followers: 978,
    following: 442,
    isFollowing: true,
    isPrivate: false,
    email: 'aya@example.com',
    phone: '+0987654321',
    gender: 'Female',
    birthday: '1989-12-03',
  }
];

const allPosts = [
  {
    _id: 'p1',
    userId: '1',
    title: 'Sunset Drawing',
    description: 'This is my sunset artwork. Experimenting with new colors and techniques.',
    image: post1,
    likes: 243,
    comments: 45,
    createdAt: '2025-05-01T14:30:00Z',
    isLiked: true,
    isSaved: false,
  },
  {
    _id: 'p2',
    userId: '1',
    title: post1,
    description: 'Playing with shapes and colors.',
    image: '/api/placeholder/400/400',
    likes: 189,
    comments: 32,
    createdAt: '2025-04-28T09:15:00Z',
    isLiked: false,
    isSaved: true,
  },
  {
    _id: 'p3',
    userId: '1',
    title: 'Mountain Landscape',
    description: 'Inspired by my recent hiking trip.',
    image: post2,
    likes: 315,
    comments: 67,
    createdAt: '2025-04-22T18:45:00Z',
    isLiked: true,
    isSaved: false,
  },
  {
    _id: 'p4',
    userId: '1',
    title: 'City Skyline',
    description: 'Urban landscape from my window.',
    image: post2,
    likes: 276,
    comments: 51,
    createdAt: '2025-04-15T11:20:00Z',
    isLiked: false,
    isSaved: false,
  },
  {
    _id: 'p5',
    userId: '2',
    title: 'Cake Design',
    description: 'I baked this yesterday.',
    image: post1,
    likes: 421,
    comments: 89,
    createdAt: '2025-05-02T10:45:00Z',
    isLiked: false,
    isSaved: false,
  },
];

const allComments = {
  p1: [
    { _id: 'c1', text: 'Beautiful!', user: { _id: '2', username: 'Aya', avatar: profile }, createdAt: '2025-05-01T15:30:00Z' },
    { _id: 'c2', text: 'Love the colors!', user: { _id: '3', username: 'Miguel', avatar: post2 }, createdAt: '2025-05-01T16:15:00Z' },
    { _id: 'c3', text: 'What brushes did you use?', user: { _id: '4', username: 'Sarah', avatar: post1 }, createdAt: '2025-05-02T09:20:00Z' },
  ],
  p2: [
    { _id: 'c4', text: 'Amazing work as always!', user: { _id: '2', username: 'Aya', avatar: post2 }, createdAt: '2025-04-28T10:30:00Z' },
    { _id: 'c5', text: 'The composition is perfect', user: { _id: '5', username: 'John', avatar: profile }, createdAt: '2025-04-28T14:45:00Z' },
  ],
  p3: [
    { _id: 'c6', text: 'I want to visit that mountain!', user: { _id: '6', username: 'Emma', avatar: post2 }, createdAt: '2025-04-22T19:30:00Z' },
  ],
  p4: [
    { _id: 'c7', text: 'Great perspective!', user: { _id: '2', username: 'Aya', avatar: profile }, createdAt: '2025-04-15T12:10:00Z' },
  ],
  p5: [
    { _id: 'c8', text: 'Looks tasty!', user: { _id: '1', username: 'Ines', avatar: post1 }, createdAt: '2025-05-02T11:30:00Z' },
  ],
};

//const stories = [
//  { _id: 's1', userId: '2', image: profile, username: 'Aya', seen: false },
//  { _id: 's2', userId: '3', image: post1, username: 'Miguel', seen: true },
//  { _id: 's3', userId: '4', image:  post1, username: 'Sarah', seen: false },
//  { _id: 's4', userId: '5', image:  post1, username: 'John', seen: true },
//  { _id: 's5', userId: '6', image:  post1, username: 'Emma', seen: false },
//];

const products = [
  {
    _id: 'prod1',
    name: 'Handcrafted Vase',
    price: 25,
    image: post1,
    description: 'Beautiful handcrafted ceramic vase, perfect for home decor!'
  },
  {
    _id: 'prod2',
    name: 'Woven Basket',
    price: 15,
    image: post2,
    description: 'Eco-friendly handmade basket, ideal for organizing your space.'
  },
  // Add more if needed
];

// Helper functions
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}

function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(null);
  const [commentMenuOpen, setCommentMenuOpen] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
//  const [showStory, setShowStory] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Form states for creating/updating posts
  const [newPostData, setNewPostData] = useState({
    title: '',
    description: '',
    image: null,
    imagePreview: null
  });
  
  // Form states for profile editing
  const [profileData, setProfileData] = useState({
    fullName: '',
    username: '',
    bio: '',
    website: '',
    email: '',
    phone: '',
    gender: '',
    birthday: '',
    avatar: null,
    avatarPreview: null
  });

  // Fetch user and posts data
  useEffect(() => {
    // Simulate API call delay
    const loadData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be API calls
        const userData = users.find(u => u._id === userId);
        if (userData) {
          setUser(userData);
          setProfileData({
            fullName: userData.fullName,
            username: userData.username,
            bio: userData.bio || '',
            website: userData.website || '',
            email: userData.email || '',
            phone: userData.phone || '',
            gender: userData.gender || '',
            birthday: userData.birthday || '',
            avatar: null,
            avatarPreview: userData.avatar
          });
          
          // Check if viewing own profile
          setIsOwnProfile(userData._id === '2'); // Assuming logged-in user ID is '1'
          
          // Get user posts
          const userPosts = allPosts.filter(p => p.userId === userId);
          setPosts(userPosts);
          
          // Generate mock followers/following
          const mockFollowers = Array(userData.followers > 20 ? 20 : userData.followers).fill().map((_, i) => ({
            _id: `follower-${i}`,
            username: `follower${i}`,
            avatar: '/api/placeholder/60/60',
            isFollowing: Math.random() > 0.5
          }));
          
          const mockFollowing = Array(userData.following > 20 ? 20 : userData.following).fill().map((_, i) => ({
            _id: `following-${i}`,
            username: `following${i}`,
            avatar: '/api/placeholder/60/60',
            isFollowing: true
          }));
          
          setFollowers(mockFollowers);
          setFollowing(mockFollowing);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [userId]);

  const isPostValid = () => {
    return newPostData.title.trim() !== '' && newPostData.description.trim() !== '' && newPostData.imagePreview;
  };

  // Handle image upload for new post
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPostData({
        ...newPostData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };
  
  // Handle avatar upload for profile edit
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        avatar: file,
        avatarPreview: URL.createObjectURL(file)
      });
    }
  };
  
  // Handle creating a new post
  const handleCreatePost = () => {
    // In a real app, this would be an API call
    const newPost = {
      _id: `p${allPosts.length + 1}`,
      userId,
      title: newPostData.title,
      description: newPostData.description,
      image: newPostData.imagePreview || '/api/placeholder/400/400',
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
      isSaved: false
    };
    
    setPosts([newPost, ...posts]);
    setNewPostData({
      title: '',
      description: '',
      image: null,
      imagePreview: null
    });
    setShowCreate(false);
  };
  
  // Handle updating a post
  const handleUpdatePost = () => {
    // In a real app, this would be an API call
    const updatedPosts = posts.map(post => {
      if (post._id === selectedPost._id) {
        return {
          ...post,
          title: newPostData.title,
          description: newPostData.description,
          image: newPostData.imagePreview || post.image
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    setNewPostData({
      title: '',
      description: '',
      image: null,
      imagePreview: null
    });
    setShowUpdate(false);
    setSelectedPost(null);
  };
  
  // Handle updating profile
  const handleUpdateProfile = () => {
    // In a real app, this would be an API call
    const updatedUser = {
      ...user,
      fullName: profileData.fullName,
      username: profileData.username,
      bio: profileData.bio,
      website: profileData.website,
      email: profileData.email,
      phone: profileData.phone,
      gender: profileData.gender,
      birthday: profileData.birthday,
      avatar: profileData.avatarPreview || user.avatar
    };
    
    setUser(updatedUser);
    setEditProfile(false);
  };
  
  // Toggle follow status
  const handleFollowToggle = () => {
    setUser({
      ...user,
      isFollowing: !user.isFollowing,
      followers: user.isFollowing ? user.followers - 1 : user.followers + 1
    });
  };
  
  // Add a new comment
  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    
    // In a real app, this would be an API call
    const newComment = {
      _id: `c${Date.now()}`,
      text: newCommentText,
      user: {
        _id: '1', // Assuming logged-in user ID is '1'
        username: 'Ines',
        avatar: '/api/placeholder/40/40'
      },
      createdAt: new Date().toISOString()
    };
    
    if (!allComments[selectedPost._id]) {
      allComments[selectedPost._id] = [];
    }
    
    allComments[selectedPost._id].push(newComment);
    
    // Update the post comment count
    const updatedPosts = posts.map(post =>
      post._id === selectedPost._id
        ? { ...post, comments: post.comments + 1 }
        : post
    );
    
    setPosts(updatedPosts);
    setNewCommentText('');
  };
  
  // Toggle like status
  const handleLikeToggle = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        const newIsLiked = !post.isLiked;
        return {
          ...post,
          isLiked: newIsLiked,
          likes: newIsLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
  };
  
  // Toggle save status
  const handleSaveToggle = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        return {
          ...post,
          isSaved: !post.isSaved
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
  };
  
  // Delete a post
  const handleDeletePost = (postId) => {
    // In a real app, this would be an API call
    const updatedPosts = posts.filter(post => post._id !== postId);
    setPosts(updatedPosts);
    
    if (selectedPost && selectedPost._id === postId) {
      setSelectedPost(null);
    }
    
    setShowPostMenu(null);
  };
  
  // Delete a comment
  const handleDeleteComment = (postId, commentId) => {
    // In a real app, this would be an API call
    if (allComments[postId]) {
      const updatedComments = allComments[postId].filter(comment => comment._id !== commentId);
      allComments[postId] = updatedComments;
      
      // Update the post comment count
      const updatedPosts = posts.map(post =>
        post._id === postId
          ? { ...post, comments: post.comments - 1 }
          : post
      );
      
      setPosts(updatedPosts);
      setCommentMenuOpen(null);
    }
  };

  // UI for loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '600' 
        }}>
          Loading profile...
        </div>
      </div>
    );
  }

  // UI for user not found
  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh' 
      }}>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '16px' 
        }}>
          User not found
        </div>
        <Link to="/" style={{ 
          color: '#3b82f6', 
          textDecoration: 'none' 
        }}>
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#f9fafb', 
      minHeight: '100vh', 
      paddingBottom: '64px' 
    }}>
      {/* Stories Bar */}
      {/*<div style={{ 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #e5e7eb', 
        padding: '12px 16px', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 10 
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          overflowX: 'auto', 
          paddingBottom: '8px', 
          maxWidth: '900px', 
          margin: '0 auto',
          scrollbarWidth: 'none' // Hide scrollbar for Firefox
        }}>
          {/* Add Story (for own profile) */}
          {/*{isOwnProfile && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: '2px solid #e5e7eb', 
                position: 'relative' 
              }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  backgroundColor: '#f3f4f6', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <span style={{ fontSize: '24px', color: '#6b7280' }}>+</span>
                </div>
              </div>
              <span style={{ fontSize: '12px', marginTop: '4px' }}>Your story</span>
            </div>
          )}
          
          {/* Stories */}
          {/*{stories.map(story => (
            <div 
              key={story._id} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                cursor: 'pointer' 
              }}
              onClick={() => setShowStory(story)}
            >
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: story.seen ? '2px solid #e5e7eb' : '2px solid #8b5cf6'
              }}>
                <img 
                  src={story.image} 
                  alt={story.username} 
                  style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '50%', 
                    objectFit: 'cover' 
                  }} 
                />
              </div>
              <span style={{ fontSize: '12px', marginTop: '4px' }}>{story.username}</span>
            </div>
          ))}
        </div>
      </div>  */}
      
      {/* Main Content */}
      <div style={{ 
        paddingTop: '96px', 
        padding: '96px 16px 0', 
        maxWidth: '900px', 
        margin: '0 auto' 
      }}>
        {/* Profile Section */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
          padding: '24px', 
          marginBottom: '24px' 
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            {/* Avatar */}
            <div style={{ 
              position: 'relative', 
              marginBottom: '16px' 
            }}>
              <img 
                src={user.avatar} 
                alt={user.username} 
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  objectFit: 'cover', 
                  border: '2px solid #e5e7eb' 
                }} 
              />
              {isOwnProfile && (
                <button 
                  style={{ 
                    position: 'absolute', 
                    bottom: '0', 
                    right: '0', 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    borderRadius: '50%', 
                    padding: '8px', 
                    border: 'none', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => setEditProfile(true)}
                >
                  📷
                </button>
              )}
            </div>
            
            {/* Profile Info */}
            <div style={{ 
              width: '100%', 
              textAlign: 'center' 
            }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                marginBottom: '16px' 
              }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  margin: '0 0 8px 0' 
                }}>
                  {user.username}
                </h2>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  marginTop: '8px' 
                }}>
                  {isOwnProfile ? (
                    <>
                      <button 
                        style={{ 
                          backgroundColor: '#f3f4f6', 
                          color: '#1f2937', 
                          padding: '6px 16px', 
                          borderRadius: '6px', 
                          fontWeight: '500', 
                          fontSize: '14px', 
                          border: 'none', 
                          cursor: 'pointer' 
                        }}
                        onClick={() => setEditProfile(true)}
                      >
                        Edit Profile
                      </button>
                      <button 
                        style={{ 
                          backgroundColor: '#f3f4f6', 
                          color: '#1f2937', 
                          padding: '6px 8px', 
                          borderRadius: '6px', 
                          border: 'none', 
                          cursor: 'pointer' 
                        }}
                        onClick={() => setShowSettings(true)}
                      >
                        ⋮
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        style={{ 
                          backgroundColor: user.isFollowing ? '#f3f4f6' : '#3b82f6', 
                          color: user.isFollowing ? '#1f2937' : 'white', 
                          padding: '6px 16px', 
                          borderRadius: '6px', 
                          fontWeight: '500', 
                          fontSize: '14px', 
                          border: 'none', 
                          cursor: 'pointer', 
                          marginRight: '8px' 
                        }}
                        onClick={handleFollowToggle}
                      >
                        {user.isFollowing ? 'Following' : 'Follow'}
                      </button>
                      <button 
                        style={{ 
                          backgroundColor: '#f3f4f6', 
                          color: '#1f2937', 
                          padding: '6px 16px', 
                          borderRadius: '6px', 
                          fontWeight: '500', 
                          fontSize: '14px', 
                          border: 'none', 
                          cursor: 'pointer' 
                        }}
                      >
                        Message
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Stats */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '24px', 
                marginBottom: '16px' 
              }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontWeight: 'bold' }}>{posts.length}</span>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    margin: '4px 0 0 0' 
                  }}>
                    Posts
                  </p>
                </div>
                <div 
                  style={{ 
                    textAlign: 'center', 
                    cursor: 'pointer' 
                  }} 
                  onClick={() => setShowFollowers(true)}
                >
                  <span style={{ fontWeight: 'bold' }}>{user.followers}</span>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    margin: '4px 0 0 0' 
                  }}>
                    Followers
                  </p>
                </div>
                <div 
                  style={{ 
                    textAlign: 'center', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => setShowFollowing(true)}
                >
                  <span style={{ fontWeight: 'bold' }}>{user.following}</span>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    margin: '4px 0 0 0' 
                  }}>
                    Following
                  </p>
                </div>
              </div>
              
              {/* Bio */}
              <div style={{ 
                fontSize: '14px', 
                textAlign: 'center', 
                maxWidth: '500px', 
                margin: '0 auto' 
              }}>
                <p style={{ 
                  fontWeight: '600', 
                  margin: '0 0 4px 0' 
                }}>
                  {user.fullName}
                </p>
                <p style={{ 
                  whiteSpace: 'pre-wrap', 
                  margin: '0 0 4px 0' 
                }}>
                  {user.bio}
                </p>
                {user.website && (
                  <a 
                    href={`https://${user.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      color: '#1e40af', 
                      fontWeight: '500', 
                      textDecoration: 'none' 
                    }}
                  >
                    {user.website}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Tabs */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
          marginBottom: '24px' 
        }}>
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #e5e7eb' 
          }}>
            <button 
              style={{ 
                flex: 1, 
                padding: '12px', 
                fontWeight: '500', 
                fontSize: '14px', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: activeTab ==='posts' ? '#000' : '#6b7280',
                borderBottom: activeTab === 'posts' ? '2px solid #000' : 'none'
              }}
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </button>
            <button 
              style={{ 
                flex: 1, 
                padding: '12px', 
                fontWeight: '500', 
                fontSize: '14px', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: activeTab === 'saved' ? '#000' : '#6b7280',
                borderBottom: activeTab === 'saved' ? '2px solid #000' : 'none'
              }}
              onClick={() => setActiveTab('saved')}
            >
              Saved
            </button>
            <button 
              style={{ 
              flex: 1, 
              padding: '12px', 
              fontWeight: '500', 
              fontSize: '14px', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: activeTab === 'products' ? '#000' : '#6b7280',
              borderBottom: activeTab === 'products' ? '2px solid #000' : 'none'
              }}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>

          </div>
          
          {/* Posts View Mode Toggle */}
          <div style={{ 
            padding: '12px', 
            display: 'flex', 
            justifyContent: 'flex-end' 
          }}>
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '6px', 
              padding: '2px' 
            }}>
              <button 
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: '4px', 
                  backgroundColor: viewMode === 'grid' ? '#ffffff' : 'transparent', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '14px' 
                }}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button 
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: '4px', 
                  backgroundColor: viewMode === 'list' ? '#ffffff' : 'transparent', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '14px' 
                }}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
            </div>
          </div>
          
          {/* Posts Content */}
          <div style={{ padding: '0 12px 12px' }}>
            {/* New Post Button (for own profile) */}
            {isOwnProfile && activeTab === 'posts' && (
              <div style={{ 
                marginBottom: '16px', 
                display: 'flex', 
                justifyContent: 'center' 
              }}>
                <button 
                  style={{ 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    padding: '8px 16px', 
                    fontWeight: '500', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px' 
                  }}
                  onClick={() => setShowCreate(true)}
                >
                  <span>+</span>
                  Create New Post
                </button>
              </div>
            )}
            
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '4px' 
              }}>
                {activeTab === 'posts' && posts.map(post => (
                  <div 
                    key={post._id} 
                    style={{ 
                      position: 'relative', 
                      aspectRatio: '1', 
                      cursor: 'pointer' 
                    }}
                    onClick={() => setSelectedPost(post)}
                  >
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        borderRadius: '4px' 
                      }} 
                    />
                    
                    {/* Stats Overlay on Hover */}
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0, 
                      background: 'rgba(0, 0, 0, 0.3)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      opacity: 0, 
                      transition: 'opacity 0.2s', 
                      borderRadius: '4px',
                      ':hover': { opacity: 1 } // Note: This won't work with inline styles, just for concept
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: '16px', 
                        color: 'white', 
                        fontWeight: '600' 
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px' 
                        }}>
                          ❤️ {post.likes}
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px' 
                        }}>
                          💬 {post.comments}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {activeTab === 'saved' && posts.filter(post => post.isSaved).map(post => (
                  <div 
                    key={post._id} 
                    style={{ 
                      position: 'relative', 
                      aspectRatio: '1', 
                      cursor: 'pointer' 
                    }}
                    onClick={() => setSelectedPost(post)}
                  >
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        borderRadius: '4px' 
                      }} 
                    />
                  </div>
                ))}
                
                {activeTab === 'products' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '12px' }}>
                    {products.map(prod => (
                      <div key={prod._id} style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setSelectedProduct(prod)}>
                        <img src={prod.image} alt={prod.name} style={{ width: '100%', borderRadius: '8px' }} />
                        <div style={{
                          position: 'absolute', bottom: '0', left: '0', right: '0',
                          background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px', textAlign: 'center',
                          fontWeight: '500'
                          }}>
                          {prod.name} — ${prod.price}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

            
            {/* List View */}
            {viewMode === 'list' && (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px' 
              }}>
                {activeTab === 'posts' && posts.map(post => (
                  <div 
                    key={post._id} 
                    style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
                    }}
                  >
                    {/* Post Header */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '12px 16px', 
                      borderBottom: '1px solid #f3f4f6' 
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        flex: 1 
                      }}>
                        <img 
                          src={user.avatar} 
                          alt={user.username} 
                          style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            marginRight: '8px' 
                          }} 
                        />
                        <span style={{ fontWeight: '500' }}>{user.username}</span>
                      </div>
                      {isOwnProfile && (
                        <button 
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            fontSize: '20px' 
                          }}
                          onClick={() => setShowPostMenu(post._id)}
                        >
                          ⋮
                        </button>
                      )}
                      
                      {/* Post Menu */}
                      {showPostMenu === post._id && (
                        <div style={{ 
                          position: 'absolute', 
                          right: '24px', 
                          backgroundColor: '#ffffff', 
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', 
                          borderRadius: '8px', 
                          overflow: 'hidden', 
                          zIndex: 10 
                        }}>
                          <button 
                            style={{ 
                              display: 'block', 
                              width: '100%', 
                              textAlign: 'left', 
                              padding: '8px 16px', 
                              backgroundColor: 'transparent', 
                              border: 'none', 
                              borderBottom: '1px solid #f3f4f6', 
                              cursor: 'pointer' 
                            }}
                            onClick={() => {
                              setNewPostData({
                                title: post.title,
                                description: post.description,
                                image: null,
                                imagePreview: post.image
                              });
                              setSelectedPost(post);
                              setShowUpdate(true);
                              setShowPostMenu(null);
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            style={{ 
                              display: 'block', 
                              width: '100%', 
                              textAlign: 'left', 
                              padding: '8px 16px', 
                              backgroundColor: 'transparent', 
                              border: 'none', 
                              color: '#ef4444', 
                              cursor: 'pointer' 
                            }}
                            onClick={() => handleDeletePost(post._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Post Image */}
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      style={{ 
                        width: '100%', 
                        height: 'auto', 
                        maxHeight: '600px', 
                        objectFit: 'cover' 
                      }} 
                    />
                    
                    {/* Post Actions */}
                    <div style={{ 
                      display: 'flex', 
                      padding: '12px 16px', 
                      gap: '16px' 
                    }}>
                      <button 
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          fontSize: '20px' 
                        }}
                        onClick={() => handleLikeToggle(post._id)}
                      >
                        {post.isLiked ? '❤️' : '🤍'}
                      </button>
                      <button 
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          fontSize: '20px' 
                        }}
                        onClick={() => setSelectedPost(post)}
                      >
                        💬
                      </button>
                      <button 
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          fontSize: '20px' 
                        }}
                      >
                        📤
                      </button>
                      <div style={{ flex: 1 }}></div>
                      <button 
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          fontSize: '20px' 
                        }}
                        onClick={() => handleSaveToggle(post._id)}
                      >
                        {post.isSaved ? '📑' : '🔖'}
                      </button>
                    </div>
                    
                    {/* Post Details */}
                    <div style={{ 
                      padding: '0 16px 16px' 
                    }}>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ fontWeight: '500' }}>{post.likes} likes</span>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ fontWeight: '500', marginRight: '4px' }}>{user.username}</span>
                        <span>{post.description}</span>
                      </div>
                      {post.comments > 0 && (
                        <button 
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            padding: '0', 
                            color: '#6b7280', 
                            cursor: 'pointer' 
                          }}
                          onClick={() => setSelectedPost(post)}
                        >
                          View all {post.comments} comments
                        </button>
                      )}
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#6b7280', 
                        marginTop: '8px' 
                      }}>
                        {formatDate(post.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {activeTab === 'saved' && posts.filter(post => post.isSaved).map(post => (
                  <div 
                    key={post._id} 
                    style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
                    }}
                  >
                    {/* Post content similar to posts tab */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '12px 16px', 
                      borderBottom: '1px solid #f3f4f6' 
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        flex: 1 
                      }}>
                        <img 
                          src={user.avatar} 
                          alt={user.username} 
                          style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            marginRight: '8px' 
                          }} 
                        />
                        <span style={{ fontWeight: '500' }}>{user.username}</span>
                      </div>
                    </div>
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      style={{ 
                        width: '100%', 
                        height: 'auto', 
                        maxHeight: '600px', 
                        objectFit: 'cover' 
                      }} 
                    />
                    <div style={{ 
                      padding: '12px 16px' 
                    }}>
                      <span style={{ fontWeight: '500', marginRight: '4px' }}>{user.username}</span>
                      <span>{post.description}</span>
                    </div>
                  </div>
                ))}
                
                {activeTab === 'product' && (
                  <div style={{ 
                    padding: '32px 0', 
                    textAlign: 'center' 
                  }}>
                    <p style={{ 
                      fontSize: '16px', 
                      color: '#6b7280' 
                    }}>
                      No tagged photos yet.
                    </p>
                  </div>
                )}
                
                {activeTab === 'posts' && posts.length === 0 && (
                  <div style={{ 
                    padding: '32px 0', 
                    textAlign: 'center' 
                  }}>
                    <p style={{ 
                      fontSize: '16px', 
                      color: '#6b7280' 
                    }}>
                      No posts yet.
                    </p>
                  </div>
                )}
                
                {activeTab === 'saved' && posts.filter(post => post.isSaved).length === 0 && (
                  <div style={{ 
                    padding: '32px 0', 
                    textAlign: 'center' 
                  }}>
                    <p style={{ 
                      fontSize: '16px', 
                      color: '#6b7280' 
                    }}>
                      No saved posts yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          )}
        </div>
      </div>
      
      {/* Modal: Post Detail */}
      {selectedPost && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50 
        }}>
          <div style={{ 
            display: 'flex', 
            width: '90%', 
            maxWidth: '1000px', 
            maxHeight: '90vh', 
            backgroundColor: '#ffffff', 
            borderRadius: '8px', 
            overflow: 'hidden' 
          }}>
            {/* Post Image */}
            <div style={{ 
              flex: '1.2', 
              backgroundColor: '#000', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '90vh', 
                  objectFit: 'contain' 
                }} 
              />
            </div>
            
            {/* Post Info & Comments */}
            <div style={{ 
              flex: '0.8', 
              display: 'flex', 
              flexDirection: 'column', 
              height: '90vh' 
            }}>
              {/* Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '16px', 
                borderBottom: '1px solid #e5e7eb' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  flex: 1 
                }}>
                  <img 
                    src={user.avatar} 
                    alt={user.username} 
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      marginRight: '8px' 
                    }} 
                  />
                  <span style={{ fontWeight: '500' }}>{user.username}</span>
                </div>
                {isOwnProfile && (
                  <div style={{ 
                    position: 'relative', 
                    display: 'inline-block' 
                  }}>
                    <button 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontSize: '20px', 
                        padding: '4px 8px' 
                      }}
                      onClick={() => setShowPostMenu(selectedPost._id)}
                    >
                      ⋮
                    </button>
                    
                    {showPostMenu === selectedPost._id && (
                      <div style={{ 
                        position: 'absolute', 
                        right: 0, 
                        top: '100%', 
                        backgroundColor: '#ffffff', 
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', 
                        borderRadius: '8px', 
                        overflow: 'hidden', 
                        zIndex: 10 
                      }}>
                        <button 
                          style={{ 
                            display: 'block', 
                            width: '100%', 
                            textAlign: 'left', 
                            padding: '8px 16px', 
                            backgroundColor: 'transparent', 
                            border: 'none', 
                            borderBottom: '1px solid #f3f4f6', 
                            cursor: 'pointer' 
                          }}
                          onClick={() => {
                            setNewPostData({
                              title: selectedPost.title,
                              description: selectedPost.description,
                              image: null,
                              imagePreview: selectedPost.image
                            });
                            setShowUpdate(true);
                            setShowPostMenu(null);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          style={{ 
                            display: 'block', 
                            width: '100%', 
                            textAlign: 'left', 
                            padding: '8px 16px', 
                            backgroundColor: 'transparent', 
                            border: 'none', 
                            color: '#ef4444', 
                            cursor: 'pointer' 
                          }}
                          onClick={() => {
                            handleDeletePost(selectedPost._id);
                            setSelectedPost(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <button 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontSize: '24px', 
                    marginLeft: '8px' 
                  }}
                  onClick={() => {
                    setSelectedPost(null);
                    setShowPostMenu(null);
                  }}
                >
                  ×
                </button>
              </div>
              
              {/* Comments */}
              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '16px', 
                borderBottom: '1px solid #e5e7eb' 
              }}>
                {/* Post Caption */}
                <div style={{ 
                  display: 'flex', 
                  marginBottom: '16px' 
                }}>
                  <img 
                    src={user.avatar} 
                    alt={user.username} 
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      marginRight: '8px' 
                    }} 
                  />
                  <div>
                    <div>
                      <span style={{ fontWeight: '500', marginRight: '4px' }}>{user.username}</span>
                      <span>{selectedPost.description}</span>
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#6b7280', 
                      marginTop: '4px' 
                    }}>
                      {formatDate(selectedPost.createdAt)}
                    </div>
                  </div>
                </div>
                
                {/* Comments List */}
                {allComments[selectedPost._id] && allComments[selectedPost._id].map(comment => (
                  <div 
                    key={comment._id} 
                    style={{ 
                      display: 'flex', 
                      marginBottom: '16px', 
                      position: 'relative' 
                    }}
                  >
                    <img 
                      src={comment.user.avatar} 
                      alt={comment.user.username} 
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        marginRight: '8px' 
                      }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div>
                        <span style={{ fontWeight: '500', marginRight: '4px' }}>{comment.user.username}</span>
                        <span>{comment.text}</span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        gap: '16px', 
                        marginTop: '4px', 
                        fontSize: '12px', 
                        color: '#6b7280' 
                      }}>
                        <span>{formatDate(comment.createdAt)}</span>
                        <button 
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            padding: '0', 
                            fontSize: '12px', 
                            color: '#6b7280', 
                            cursor: 'pointer' 
                          }}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                    
                    {comment.user._id === '1' && (
                      <div style={{ 
                        position: 'relative', 
                        display: 'inline-block' 
                      }}>
                        <button 
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            fontSize: '16px', 
                            padding: '4px 8px' 
                          }}
                          onClick={() => setCommentMenuOpen(comment._id)}
                        >
                          ⋮
                        </button>
                        
                        {commentMenuOpen === comment._id && (
                          <div style={{ 
                            position: 'absolute', 
                            right: 0, 
                            top: '100%', 
                            backgroundColor: '#ffffff', 
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', 
                            borderRadius: '8px', 
                            overflow: 'hidden', 
                            zIndex: 10 
                          }}>
                            <button 
                              style={{ 
                                display: 'block', 
                                width: '100%', 
                                textAlign: 'left', 
                                padding: '8px 16px', 
                                backgroundColor: 'transparent', 
                                border: 'none', 
                                color: '#ef4444', 
                                cursor: 'pointer' 
                              }}
                              onClick={() => handleDeleteComment(selectedPost._id, comment._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Actions */}
              <div style={{ padding: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  marginBottom: '12px', 
                  gap: '16px' 
                }}>
                  <button 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontSize: '24px' 
                    }}
                    onClick={() => handleLikeToggle(selectedPost._id)}
                  >
                    {selectedPost.isLiked ? '❤️' : '🤍'}
                  </button>
                  <button 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontSize: '24px' 
                    }}
                  >
                    💬
                  </button>
                  <button 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontSize: '24px' 
                    }}
                  >
                    📤
                  </button>
                  <div style={{ flex: 1 }}></div>
                  <button 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontSize: '24px' 
                    }}
                    onClick={() => handleSaveToggle(selectedPost._id)}
                  >
                    {selectedPost.isSaved ? '📑' : '🔖'}
                  </button>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: '500' }}>{selectedPost.likes} likes</span>
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  marginBottom: '12px' 
                }}>
                  {formatDate(selectedPost.createdAt)}
                </div>
                
                {/* Comment Input */}
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  alignItems: 'center' 
                }}>
                  <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    value={newCommentText} 
                    onChange={(e) => setNewCommentText(e.target.value)} 
                    style={{ 
                      flex: 1, 
                      padding: '8px 12px', 
                      borderRadius: '20px', 
                      border:'1px solid #e5e7eb',
                      outline: 'none'
                    }} 
                  />
                  <button 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#3b82f6', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      opacity: newCommentText ? 1 : 0.5 
                    }}
                    disabled={!newCommentText}
                    onClick={() => handleAddComment(selectedPost._id)}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal: Create New Post */}
      {showCreate && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50 
        }}>
          <div style={{ 
            width: '90%', 
            maxWidth: '600px', 
            backgroundColor: '#ffffff', 
            borderRadius: '8px', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '16px', 
              borderBottom: '1px solid #e5e7eb' 
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '600' 
              }}>
                Create New Post
              </h2>
              <button 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '24px' 
                }}
                onClick={() => setShowCreate(false)}
              >
                ×
              </button>
            </div>
            
            <div style={{ padding: '16px' }}>
              {/* Image Upload */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Image
                </label>
                {newPostData.imagePreview ? (
                  <div style={{ 
                    position: 'relative',
                    marginBottom: '12px' 
                  }}>
                    <img 
                      src={newPostData.imagePreview} 
                      alt="Preview" 
                      style={{ 
                        width: '100%', 
                        maxHeight: '300px', 
                        objectFit: 'contain',
                        borderRadius: '4px' 
                      }} 
                    />
                    <button 
                      style={{ 
                        position: 'absolute', 
                        top: '8px', 
                        right: '8px', 
                        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '50%', 
                        width: '32px', 
                        height: '32px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                      onClick={() => setNewPostData({
                        ...newPostData,
                        image: null,
                        imagePreview: null
                      })}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div style={{
                    border: '2px dashed #e5e7eb',
                    borderRadius: '8px',
                    padding: '32px',
                    textAlign: 'center',
                    marginBottom: '12px'
                  }}>
                    <input 
                      type="file" 
                      id="image-upload" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={handleImageChange} 
                    />
                    <label 
                      htmlFor="image-upload"
                      style={{
                        display: 'block',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ 
                        fontSize: '32px', 
                        marginBottom: '8px' 
                      }}>📷</div>
                      <div style={{ 
                        fontWeight: '500', 
                        marginBottom: '8px' 
                      }}>
                        Upload an image
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#6b7280' 
                      }}>
                        Click to browse files
                      </div>
                    </label>
                  </div>
                )}
              </div>
              
              {/* Title */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Title
                </label>
                <input 
                  type="text" 
                  value={newPostData.title} 
                  onChange={(e) => setNewPostData({...newPostData, title: e.target.value})} 
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid #e5e7eb',
                    outline: 'none'
                  }} 
                  placeholder="Add a title..." 
                />
              </div>
              
              {/* Description */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Description
                </label>
                <textarea 
                  value={newPostData.description} 
                  onChange={(e) => setNewPostData({...newPostData, description: e.target.value})} 
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid #e5e7eb',
                    outline: 'none',
                    minHeight: '100px',
                    resize: 'vertical'
                  }} 
                  placeholder="Add a description..." 
                />
              </div>
              
              {/* Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end' 
              }}>
                <button 
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    backgroundColor: '#f3f4f6', 
                    border: 'none', 
                    fontWeight: '500', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
                <button 
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    border: 'none', 
                    fontWeight: '500', 
                    cursor: 'pointer',
                    opacity: isPostValid() ? 1 : 0.5
                  }}
                  disabled={!isPostValid()}
                  onClick={handleCreatePost}
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal: Update Post */}
      {showUpdate && selectedPost && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50 
        }}>
          <div style={{ 
            width: '90%', 
            maxWidth: '600px', 
            backgroundColor: '#ffffff', 
            borderRadius: '8px', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '16px', 
              borderBottom: '1px solid #e5e7eb' 
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '600' 
              }}>
                Update Post
              </h2>
              <button 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '24px' 
                }}
                onClick={() => setShowUpdate(false)}
              >
                ×
              </button>
            </div>
            
            <div style={{ padding: '16px' }}>
              {/* Image Preview */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Image
                </label>
                {newPostData.imagePreview && (
                  <div style={{ marginBottom: '12px' }}>
                    <img 
                      src={newPostData.imagePreview} 
                      alt="Preview" 
                      style={{ 
                        width: '100%', 
                        maxHeight: '300px', 
                        objectFit: 'contain',
                        borderRadius: '4px' 
                      }} 
                    />
                  </div>
                )}
                <input 
                  type="file" 
                  id="update-image" 
                  accept="image/*" 
                  style={{ 
                    display: 'block',
                    marginTop: '8px' 
                  }}
                  onChange={handleImageChange} 
                />
              </div>
              
              {/* Title */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Title
                </label>
                <input 
                  type="text" 
                  value={newPostData.title} 
                  onChange={(e) => setNewPostData({...newPostData, title: e.target.value})} 
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid #e5e7eb',
                    outline: 'none'
                  }} 
                />
              </div>
              
              {/* Description */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Description
                </label>
                <textarea 
                  value={newPostData.description} 
                  onChange={(e) => setNewPostData({...newPostData, description: e.target.value})} 
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid #e5e7eb',
                    outline: 'none',
                    minHeight: '100px',
                    resize: 'vertical'
                  }} 
                />
              </div>
              
              {/* Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end' 
              }}>
                <button 
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    backgroundColor: '#f3f4f6', 
                    border: 'none', 
                    fontWeight: '500', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => setShowUpdate(false)}
                >
                  Cancel
                </button>
                <button 
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    border: 'none', 
                    fontWeight: '500', 
                    cursor: 'pointer',
                    opacity: isPostValid() ? 1 : 0.5
                  }}
                  disabled={!isPostValid()}
                  onClick={() => handleUpdatePost(selectedPost._id)}
                >
                  Update Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal: Edit Profile */}
      {editProfile && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50 
        }}>
          <div style={{ 
            width: '90%', 
            maxWidth: '500px', 
            backgroundColor: '#ffffff', 
            borderRadius: '8px', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '16px', 
              borderBottom: '1px solid #e5e7eb' 
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '600' 
              }}>
                Edit Profile
              </h2>
              <button 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '24px' 
                }}
                onClick={() => setEditProfile(false)}
              >
                ×
              </button>
            </div>
            
            <div style={{ padding: '16px' }}>
              {/* Avatar */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                marginBottom: '20px' 
              }}>
                <div style={{ 
                  position: 'relative', 
                  marginBottom: '12px' 
                }}>
                  <img 
                    src={profileData.avatarPreview || user.avatar} 
                    alt="Avatar" 
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      borderRadius: '50%', 
                      objectFit: 'cover' 
                    }} 
                  />
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '0', 
                    right: '0', 
                    backgroundColor: '#3b82f6', 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer',
                    border: '2px solid white'
                  }}>
                    <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
                      📷
                    </label>
                    <input 
                      type="file" 
                      id="avatar-upload" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={handleAvatarChange} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Name
                </label>
                <input 
                  type="text" 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid #e5e7eb',
                    outline: 'none'
                  }} 
                />
              </div>
              
              {/* Username */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Username
                </label>
                <input 
                  type="text" 
                  value={profileData.username} 
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})} 
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid #e5e7eb',
                    outline: 'none'
                  }} 
                />
              </div>
              
              {/* Bio */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Bio
                </label>
                <textarea 
                  value={profileData.bio} 
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})} 
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid #e5e7eb',
                    outline: 'none',
                    minHeight: '80px',
                    resize: 'vertical'
                  }} 
                />
              </div>
              
              {/* Website */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Website
                </label>
                <input 
                  type="url" 
                  value={profileData.website} 
                  onChange={(e) => setProfileData({...profileData, website: e.target.value})} 
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid #e5e7eb',
                    outline: 'none'
                  }} 
                  placeholder="https://example.com" 
                />
              </div>
              
              {/* Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end' 
              }}>
                <button 
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    backgroundColor: '#f3f4f6', 
                    border: 'none', 
                    fontWeight: '500', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => setEditProfile(false)}
                >
                  Cancel
                </button>
                <button 
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    border: 'none', 
                    fontWeight: '500', 
                    cursor: 'pointer'
                  }}
                  onClick={handleUpdateProfile}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Followers Modal */}
{showFollowers && (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 60
  }}>
    <div style={{
      width: '90%', maxWidth: '400px', backgroundColor: '#fff',
      borderRadius: '8px', padding: '16px', overflowY: 'auto', maxHeight: '80vh'
    }}>
      <h3 style={{ marginBottom: '16px' }}>Followers</h3>
      {followers.map(f => (
        <div key={f._id} style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={f.avatar} alt={f.username} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            <span>{f.username}</span>
          </div>
          {f.isFollowing ? (
            <button style={{ padding: '4px 8px', border: 'none', borderRadius: '4px', backgroundColor: '#e5e7eb' }}>Following</button>
          ) : (
            <button style={{ padding: '4px 8px', border: 'none', borderRadius: '4px', backgroundColor: '#3b82f6', color: '#fff' }}>Follow</button>
          )}
        </div>
      ))}
      <button
        onClick={() => setShowFollowers(false)}
        style={{ marginTop: '16px', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
      >
        Close
      </button>
    </div>
  </div>
)}

{/* Following Modal */}
{showFollowing && (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 60
  }}>
    <div style={{
      width: '90%', maxWidth: '400px', backgroundColor: '#fff',
      borderRadius: '8px', padding: '16px', overflowY: 'auto', maxHeight: '80vh'
    }}>
      <h3 style={{ marginBottom: '16px' }}>Following</h3>
      {following.map(f => (
        <div key={f._id} style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={f.avatar} alt={f.username} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            <span>{f.username}</span>
          </div>
          <button style={{ padding: '4px 8px', border: 'none', borderRadius: '4px', backgroundColor: '#f87171', color: '#fff' }}>
            Unfollow
          </button>
        </div>
      ))}
      <button
        onClick={() => setShowFollowing(false)}
        style={{ marginTop: '16px', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
      >
        Close
      </button>
    </div>
  </div>
)}
{showSettings && (
  <div style={{
    position: 'absolute',
    top: '48px',
    right: '0',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    zIndex: 20
  }}>
    <button style={{ padding: '12px 16px', width: '100%', textAlign: 'left', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
      Account Settings
    </button>
    <button style={{ padding: '12px 16px', width: '100%', textAlign: 'left', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
      Privacy Settings
    </button>
    <button
      onClick={() => setShowSettings(false)}
      style={{ padding: '12px 16px', width: '100%', textAlign: 'left', border: 'none', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer' }}
    >
      Close
    </button>
  </div>
)}

{selectedProduct && (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 60
  }}>
    <div style={{
      backgroundColor: '#fff', padding: '24px', borderRadius: '8px',
      maxWidth: '500px', width: '90%', position: 'relative'
    }}>
      <button
        onClick={() => setSelectedProduct(null)}
        style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer'
        }}
      >×</button>
      <img src={selectedProduct.image} alt={selectedProduct.name} style={{
        width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px'
      }} />
      <h2 style={{ marginTop: '16px' }}>{selectedProduct.name}</h2>
      <p style={{ color: '#6b7280', marginBottom: '8px' }}>${selectedProduct.price}</p>
      <p>{selectedProduct.description}</p>
    </div>
  </div>
)}


{/*{showStory && (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 60
  }}>
    <div style={{ position: 'relative' }}>
      <img src={showStory.image} alt="Story" style={{ maxHeight: '90vh', maxWidth: '90vw', borderRadius: '12px' }} />
      <button
        onClick={() => setShowStory(null)}
        style={{
          position: 'absolute', top: '16px', right: '16px',
          fontSize: '24px', color: 'white', background: 'none', border: 'none', cursor: 'pointer'
        }}
      >
        ×
      </button>
    </div>
  </div>
)} */ }
    </div>
  </div>
  );
}

export default ProfilePage;