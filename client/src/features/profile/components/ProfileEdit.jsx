import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  Typography
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

const ProfileEdit = ({ user, open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    profilePicture: null,
    previewUrl: null
  });

  useEffect(() => {
  setFormData({
    name: user?.name || '',
    bio: user?.bio || '',
    profilePicture: null,
    previewUrl: null
  });
}, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        profilePicture: file,
        previewUrl: previewUrl
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = {
        name: formData.name,
        bio: formData.bio,
        profilePicture: formData.profilePicture
      };
      
      await onSave(formDataToSend);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle>Edit Profile</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 3
          }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={formData.previewUrl || user?.profilePicture || user?.avatar}
                alt={formData.name}
                sx={{ 
                  width: 120, 
                  height: 120,
                  mb: 1
                }}
              />
              <IconButton
                color="primary"
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'background.paper',
                  '&:hover': { backgroundColor: 'background.paper' }
                }}
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                />
                <PhotoCamera />
              </IconButton>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Click the camera icon to change profile picture
            </Typography>
          </Box>

          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="bio"
            label="Bio"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProfileEdit;