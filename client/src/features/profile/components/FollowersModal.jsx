import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
  Button,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { users } from '../../data/mockData';

const FollowersModal = ({ open, onClose, followers }) => {
  // Filter users who are followers (this is mock data, in a real app this would come from the API)
  const followerUsers = users.filter(user => user._id !== '1'); // Excluding the current user

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Followers</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <List sx={{ pt: 0 }}>
          {followerUsers.map((user) => (
            <ListItem
              key={user._id}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <ListItemAvatar>
                <Avatar src={user.avatar} alt={user.username} />
              </ListItemAvatar>
              <ListItemText
                primary={user.username}
                secondary={user.fullName}
                sx={{ mr: 2 }}
              />
              <Button
                variant={user.isFollowing ? "outlined" : "contained"}
                size="small"
                onClick={() => {
                  // In a real app, this would call an API to follow/unfollow
                  console.log(`Toggle follow for user: ${user._id}`);
                }}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </Button>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersModal; 