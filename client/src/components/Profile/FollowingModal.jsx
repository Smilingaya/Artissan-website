import React from 'react';
import { Modal, Box, Typography, Button, List, ListItem, ListItemAvatar, Avatar } from '@mui/material';

const FollowingModal = ({ open, onClose, following }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 3, margin: 'auto', bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" mb={2}>Following</Typography>
        <List>
          {following.map(f => (
            <ListItem key={f._id} sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemAvatar>
                <Avatar src={f.avatar} />
              </ListItemAvatar>
              <Typography variant="body1">{f.username}</Typography>
            </ListItem>
          ))}
        </List>
        <Button onClick={onClose} sx={{ mt: 2 }}>Close</Button>
      </Box>
    </Modal>
  );
};

export default FollowingModal;
