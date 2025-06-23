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
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPasswordError = validatePassword(newPassword);
    const confirmPasswordError = newPassword !== confirmPassword
      ? "Passwords don't match"
      : "";

    setErrors({
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError
    });

    if (!newPasswordError && !confirmPasswordError) {
      onComplete(newPassword);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Enter New Password
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Your password must be at least 6 characters. You can choose any characters you want.
      </Typography>

      <Typography variant="caption" fontWeight="500" sx={{ mb: 0.5, display: 'block' }}>
        Password
      </Typography>
      <TextField
        fullWidth
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter password"
        variant="outlined"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          setErrors({ ...errors, newPassword: '' });
        }}
        inputProps={{ minLength: 6 }}
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
        placeholder="Re-enter password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setErrors({ ...errors, confirmPassword: '' });
        }}
        inputProps={{ minLength: 6 }}
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
