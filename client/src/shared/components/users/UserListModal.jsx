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
  Box
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserListModal = ({ 
  open, 
  onClose, 
  users = [], 
  title = "Users",
  emptyMessage = "No users to display"
}) => {
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
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 1 }}>
        {users.length > 0 ? (
          <List sx={{ py: 0 }}>
            {users.map((user) => (
              <ListItem 
                key={user.id} 
                button 
                onClick={() => handleUserClick(user.id)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    src={user.avatar}
                    alt={user.name}
                    sx={{ width: 40, height: 40 }}
                  />
                </ListItemAvatar>
                <ListItemText 
                  primary={user.name}
                  secondary={user.bio || user.status || ""}
                  primaryTypographyProps={{
                    fontWeight: 500
                  }}
                  secondaryTypographyProps={{
                    noWrap: true
                  }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ 
            py: 4, 
            textAlign: 'center',
            color: 'text.secondary'
          }}>
            <Typography variant="body1">
              {emptyMessage}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserListModal; 