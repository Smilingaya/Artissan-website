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
  Box,
  Button
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserListModal = ({ open, onClose, title, users }) => {
  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'text.secondary',
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {users.length > 0 ? (
          <List sx={{ py: 0 }}>
            {users.map((user) => (
              <ListItem
                key={user._id}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => handleUserClick(user._id)}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar} alt={user.name}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={user.bio}
                  primaryTypographyProps={{
                    variant: 'subtitle2',
                    color: 'text.primary'
                  }}
                  secondaryTypographyProps={{
                    noWrap: true,
                    variant: 'body2'
                  }}
                />
                <Button
                  variant={user.isFollowing ? 'outlined' : 'contained'}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle follow/unfollow
                  }}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </Button>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No users to display
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserListModal; 