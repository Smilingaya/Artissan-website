import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Edit, AccountCircle, Settings } from '@mui/icons-material';

const ProfileHeader = ({ user, onEditProfile, onShowFollowers, onShowFollowing, onOpenSettings }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ mb: 4 }}>
      <AccountCircle sx={{ fontSize: 100 }} />
      <Typography variant="h5">{user.name}</Typography>
      <Typography variant="body2" color="text.secondary">{user.bio}</Typography>

      <Box display="flex" gap={2} sx={{ mt: 2 }}>
        <IconButton onClick={onShowFollowers}>
          <Typography variant="body2">{user.followers.length} Followers</Typography>
        </IconButton>
        <IconButton onClick={onShowFollowing}>
          <Typography variant="body2">{user.following.length} Following</Typography>
        </IconButton>
      </Box>

      <Box display="flex" gap={2} sx={{ mt: 2 }}>
        <IconButton onClick={onEditProfile}>
          <Edit />
        </IconButton>
        <IconButton onClick={onOpenSettings}>
          <Settings />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ProfileHeader;
