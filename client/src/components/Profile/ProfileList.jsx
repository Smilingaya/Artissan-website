import React from 'react';
import PropTypes from 'prop-types';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  ChatBubbleOutline, 
  MoreVert,
  Delete,
  Edit
} from '@mui/icons-material';

const ProfileList = ({ items = [], onItemClick, isOwnProfile }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const handleMenuOpen = (event, item) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleEdit = () => {
    // Implement edit functionality
    handleMenuClose();
  };

  const handleDelete = () => {
    // Implement delete functionality
    handleMenuClose();
  };

  if (!items || items.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 5,
        color: 'text.secondary'
      }}>
        <Typography variant="h6" gutterBottom>
          No posts yet
        </Typography>
        <Typography variant="body2">
          When you share posts, they will appear here.
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
      {items.map(item => (
        <ListItem 
          key={item._id}
          onClick={() => onItemClick(item)}
          sx={{ 
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <ListItemAvatar>
            <Avatar 
              variant="rounded"
              src={item.image} 
              alt={item.title}
              sx={{ width: 100, height: 100, mr: 2 }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle1" component="div" gutterBottom>
                {item.title}
              </Typography>
            }
            secondary={
              <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                  {item.isLiked ? (
                    <Favorite sx={{ fontSize: 18, color: 'error.main', mr: 0.5 }} />
                  ) : (
                    <FavoriteBorder sx={{ fontSize: 18, mr: 0.5 }} />
                  )}
                  <Typography component="span" variant="body2" color="text.secondary">
                    {item.likes}
                  </Typography>
                </Box>
                <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ChatBubbleOutline sx={{ fontSize: 18, mr: 0.5 }} />
                  <Typography component="span" variant="body2" color="text.secondary">
                    {item.comments}
                  </Typography>
                </Box>
              </Box>
            }
          />
          {isOwnProfile && (
            <ListItemSecondaryAction>
              <IconButton 
                edge="end" 
                onClick={(e) => handleMenuOpen(e, item)}
                sx={{ color: 'text.secondary' }}
              >
                <MoreVert />
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>
    </List>
  );
};

ProfileList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      likes: PropTypes.number.isRequired,
      comments: PropTypes.number.isRequired,
      isLiked: PropTypes.bool
    })
  ),
  onItemClick: PropTypes.func.isRequired,
  isOwnProfile: PropTypes.bool
};

export default ProfileList;
