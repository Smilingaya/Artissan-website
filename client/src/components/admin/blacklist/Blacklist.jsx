import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';

const Blacklist = () => {
  const [blacklistedUsers, setBlacklistedUsers] = useState([
    { id: 1, username: 'user123', email: 'user123@example.com', reason: 'Spam activities', date: '2023-05-10' },
    { id: 2, username: 'baduser', email: 'baduser@example.com', reason: 'Abusive behavior', date: '2023-05-12' },
    { id: 3, username: 'spammer99', email: 'spammer99@example.com', reason: 'Multiple spam posts', date: '2023-05-15' },
  ]);

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    reason: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  const handleAddToBlacklist = () => {
    if (!newUser.username || !newUser.email || !newUser.reason) {
      alert('Please fill in all fields');
      return;
    }
    
    const newId = blacklistedUsers.length > 0 
      ? Math.max(...blacklistedUsers.map(user => user.id)) + 1 
      : 1;
      
    const today = new Date().toISOString().split('T')[0];
    
    const userToAdd = {
      id: newId,
      username: newUser.username,
      email: newUser.email,
      reason: newUser.reason,
      date: today
    };
    
    setBlacklistedUsers([...blacklistedUsers, userToAdd]);
    setNewUser({ username: '', email: '', reason: '' });
  };

  const handleRemoveFromBlacklist = (id) => {
    setBlacklistedUsers(blacklistedUsers.filter(user => user.id !== id));
  };

  return (
    <Box sx={{ p: 3 , mt:8}}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 500, color: '#333' }}>
        User Blacklist Management
      </Typography>
      
      <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>Add User to Blacklist</Typography>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={newUser.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={newUser.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              variant="outlined"
            />
          </Grid>
        </Grid>
        
        <TextField
          fullWidth
          label="Reason"
          name="reason"
          multiline
          rows={4}
          value={newUser.reason}
          onChange={handleInputChange}
          placeholder="Enter reason for blacklisting"
          variant="outlined"
          sx={{ mb: 3 }}
        />
        
        <Button 
          variant="contained" 
          onClick={handleAddToBlacklist}
          sx={{ 
            bgcolor: '#2E8B57', 
            '&:hover': { bgcolor: '#236b43' }
          }}
        >
          Add to Blacklist
        </Button>
      </Paper>
      
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>Blacklisted Users</Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f9f9f9' }}>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Date Added</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blacklistedUsers.length > 0 ? (
                blacklistedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.reason}</TableCell>
                    <TableCell>{user.date}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFromBlacklist(user.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#999' }}>
                    No users in blacklist
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Blacklist;