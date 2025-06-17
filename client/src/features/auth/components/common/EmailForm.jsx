import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField,
} from '@mui/material';
import FormButton from './FormButton';

const EmailForm = ({ onNext }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // If validation passes, proceed to next step
    onNext(email);
  };

  return (
    <Box
  component="form"
  onSubmit={handleSubmit}
  sx={{
    p: 3,
    borderRadius: 2,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(12px)',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  }}
>
      <Typography variant="h6" align="center" gutterBottom>
        Mail Address Here
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Enter the email address associated with your account.
      </Typography>
      
      <Typography variant="caption" fontWeight="500" sx={{ mb: 0.5, display: 'block' }}>
        Email
      </Typography>
      <TextField
        fullWidth
        placeholder="johndoe@gmail.com"
        variant="outlined"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
        error={!!error}
        helperText={error}
        sx={{ mb: 2 }}
        InputProps={{
          sx: { bgcolor: 'white' }
        }}
      />
      
      <FormButton type="submit">
        Recover Password
      </FormButton>
    </Box>
  );
};

export default EmailForm;