
import React, { useState } from 'react';
import { 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  ListItemSecondaryAction,
  Avatar, 
  Typography, 
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';

const UserListItem = ({ user }) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  
  const handleFollowToggle = (e) => {
    e.preventDefault();
    setIsFollowing(!isFollowing);
    // In a real app, you would call an API to follow/unfollow
  };

  return (
    <ListItem 
      button
      component={Link}
      to={`/profile/${user._id}`}
      divider
    >
      <ListItemAvatar>
        <Avatar src={user.avatar} alt={user.username} />
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <Typography variant="subtitle2" component="span">
            {user.username}
          </Typography>
        }
        secondary={user.fullName}
      />
      
      <ListItemSecondaryAction>
        <Button
          variant={isFollowing ? "outlined" : "contained"}
          size="small"
          onClick={handleFollowToggle}
          color="primary"
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default UserListItem;