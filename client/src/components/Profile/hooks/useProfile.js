// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

/**
 * Custom hook for profile data management
 * @param {string} username - Username of the profile to fetch (defaults to logged-in user)
 * @returns {Object} - Profile data and functions
 */
const useProfile = (username = null) => {
  // State for profile data
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Get current user from context
  const { user, isAuthenticated } = useUser();
  
  // Determine which username to fetch
  const targetUsername = username || (user && user.username);
  
  // Check if the profile belongs to the current user
  const isOwnProfile = isAuthenticated && user && targetUsername === user.username;
  
  // Fetch profile data
  useEffect(() => {
    if (!targetUsername) return;
    
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/users/${targetUsername}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const profileData = await response.json();
        setProfile(profileData);
        setStats({
          posts: profileData.postCount || 0,
          followers: profileData.followerCount || 0,
          following: profileData.followingCount || 0
        });
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [targetUsername, refreshTrigger]);
  
  /**
   * Update profile data
   * @param {Object} updatedData - Updated profile data
   * @returns {Promise<Object>} - Update result
   */
  const updateProfile = async (updatedData) => {
    if (!isAuthenticated || !isOwnProfile) {
      return { success: false, error: 'Unauthorized' };
    }
    
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      
      // Handle profile image if provided
      if (updatedData.profileImage && updatedData.profileImage instanceof File) {
        formData.append('profileImage', updatedData.profileImage);
      }
      
      // Add other profile data
      Object.keys(updatedData).forEach(key => {
        if (key !== 'profileImage' || typeof updatedData[key] !== 'object') {
          formData.append(key, updatedData[key]);
        }
      });
      
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }
      
      const result = await response.json();
      setProfile(prev => ({ ...prev, ...result }));
      setRefreshTrigger(prev => prev + 1);
      
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Follow/unfollow a user
   * @param {boolean} shouldFollow - Whether to follow (true) or unfollow (false)
   * @returns {Promise<Object>} - Follow/unfollow result
   */
  const toggleFollow = async (shouldFollow = true) => {
    if (!isAuthenticated) {
      return { success: false, error: 'You must be logged in to follow users' };
    }
    
    // Cannot follow yourself
    if (isOwnProfile) {
      return { success: false, error: 'You cannot follow yourself' };
    }
    
    try {
      setIsLoading(true);
      
      const endpoint = shouldFollow ? 'follow' : 'unfollow';
      const response = await fetch(`/api/users/${targetUsername}/${endpoint}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${endpoint}`);
      }
      
      const result = await response.json();
      
      // Update follower count in stats
      setStats(prev => ({
        ...prev,
        followers: shouldFollow ? prev.followers + 1 : Math.max(0, prev.followers - 1)
      }));
      
      // Update isFollowing status in profile
      setProfile(prev => ({
        ...prev,
        isFollowing: shouldFollow
      }));
      
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch followers or following users
   * @param {string} type - Either 'followers' or 'following'
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of users per page
   * @returns {Promise<Object>} - List of users
   */
  const fetchUserList = async (type = 'followers', page = 1, limit = 20) => {
    if (!targetUsername) {
      return { success: false, error: 'No username specified' };
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch(
        `/api/users/${targetUsername}/${type}?page=${page}&limit=${limit}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch ${type}`);
      }
      
      const result = await response.json();
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Refresh profile data
   */
  const refreshProfile = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  return {
    profile,
    isLoading,
    error,
    stats,
    isOwnProfile,
    updateProfile,
    toggleFollow,
    fetchUserList,
    refreshProfile
  };
};

export default useProfile;