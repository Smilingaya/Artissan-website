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

const FollowingModal = ({ open, onClose, following }) => {
  // Filter users being followed (this is mock data, in a real app this would come from the API)
  const followingUsers = users.filter(user => user._id !== '1'); // Excluding the current user

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Following</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <List sx={{ pt: 0 }}>
          {followingUsers.map((user) => (
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
                variant="outlined"
                size="small"
                onClick={() => {
                  // In a real app, this would call an API to unfollow
                  console.log(`Unfollow user: ${user._id}`);
                }}
              >
                Following
              </Button>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default FollowingModal; 