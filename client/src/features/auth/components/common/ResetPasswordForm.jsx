import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormButton from './FormButton';

const ResetPasswordForm = ({ onComplete }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const validatePassword = (password) => {
    // Password validation requirements
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      return "Password must include uppercase, lowercase, numbers and special characters";
    }
    
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate new password
    const newPasswordError = validatePassword(newPassword);
    
    // Check if passwords match
    const passwordMatchError = newPassword !== confirmPassword 
      ? "Passwords don't match" 
      : "";
    
    setErrors({
      newPassword: newPasswordError,
      confirmPassword: passwordMatchError
    });
    
    // If validation passes, complete the password reset
    if (!newPasswordError && !passwordMatchError) {
      onComplete();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Enter New Password
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Your new password must be different from previously used passwords.
      </Typography>
      
      <Typography variant="caption" fontWeight="500" sx={{ mb: 0.5, display: 'block' }}>
        Password
      </Typography>
      <TextField
        fullWidth
        type={showPassword ? 'text' : 'password'}
        placeholder="********"
        variant="outlined"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          setErrors({...errors, newPassword: ''});
        }}
        error={!!errors.newPassword}
        helperText={errors.newPassword}
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          sx: { bgcolor: 'white' }
        }}
      />
      
      <Typography variant="caption" fontWeight="500" sx={{ mb: 0.5, display: 'block' }}>
        Confirm Password
      </Typography>
      <TextField
        fullWidth
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="********"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setErrors({...errors, confirmPassword: ''});
        }}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          sx: { bgcolor: 'white' }
        }}
      />
      
      <FormButton type="submit">
        Continue
      </FormButton>
    </Box>
  );
};

export default ResetPasswordForm;