import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  Button,
  IconButton,
  Paper,
  Stack,
  Divider
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useAuth } from '../../../shared/contexts/UserContext';

const ProfileHeader = ({
  user,
  isOwnProfile,
  onEditProfile,
  onFollowToggle,
  postsCount,
  productsCount,
  followersCount,
  followingCount,
  onShowFollowers,
  onShowFollowing
}) => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  
  // Debug logging
  console.log('ProfileHeader received user:', user);
  console.log('ProfileHeader received props:', { isOwnProfile, postsCount, productsCount, followersCount, followingCount });
  
  // Use the passed counts instead of calculating from arrays
  const displayFollowersCount = followersCount || 0;
  const displayFollowingCount = followingCount || 0;

  console.log('Display counts:', { displayFollowersCount, displayFollowingCount });

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3,
        mb: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        position: 'relative'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
        <Avatar
          src={user?.profilePicture || user?.avatar}
          alt={user?.name || 'User'}
          sx={{
            width: 120,
            height: 120,
            border: '4px solid',
            borderColor: 'background.paper',
            boxShadow: 1
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h4" component="h1">
              {user?.name || 'User'}
            </Typography>
            {isOwnProfile ? (
              <IconButton onClick={onEditProfile} size="small">
                <Edit />
              </IconButton>
            ) : !isAdmin && (
              <Button
                variant={user?.isFollowing ? "outlined" : "contained"}
                onClick={onFollowToggle}
                sx={{ ml: 2 }}
              >
                {user?.isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </Box>
          
          {user?.bio && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {user.bio}
            </Typography>
          )}

          <Stack
            direction="row"
            spacing={3}
            divider={<Divider orientation="vertical" flexItem />}
            sx={{ mb: 2 }}
          >
            <Box sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={onShowFollowers}>
              <Typography variant="h6" component="div">
                {displayFollowersCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Followers
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={onShowFollowing}>
              <Typography variant="h6" component="div">
                {displayFollowingCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Following
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" component="div">
                {postsCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Posts
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" component="div">
                {productsCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Products
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileHeader;