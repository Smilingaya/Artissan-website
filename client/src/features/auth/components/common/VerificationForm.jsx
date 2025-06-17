import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography,
  Stack,
  TextField,
  Link
} from '@mui/material';
import FormButton from './FormButton';

const VerificationForm = ({ email, onNext }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  // Handle input change and auto-focus to next input
  const handleChange = (index, value) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto focus to next input if current input is filled
      if (value !== '' && index < 3) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  // Handle backspace and left/right arrow keys
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // If current input is empty and backspace is pressed, focus previous input
      inputRefs[index - 1].current.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all digits are entered
    if (code.some(digit => digit === '')) {
      setError('Please enter all digits of your verification code');
      return;
    }
    
    // If validation passes, proceed to next step
    onNext(code.join(''));
  };

  // Handle pasting verification code
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    
    if (pasteData.length > 0) {
      const newCode = [...code];
      
      for (let i = 0; i < pasteData.length && i < 4; i++) {
        newCode[i] = pasteData[i];
      }
      
      setCode(newCode);
      
      // Focus on the appropriate input after paste
      if (pasteData.length < 4) {
        inputRefs[pasteData.length].current.focus();
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Get Your Code
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Please enter the 4 digit code that was sent to your email address.
      </Typography>
      
      <Stack 
        direction="row" 
        spacing={1} 
        justifyContent="center" 
        sx={{ mb: 2 }}
        onPaste={handlePaste}
      >
        {code.map((digit, index) => (
          <TextField
            key={index}
            inputRef={inputRefs[index]}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            variant="outlined"
            inputProps={{
              maxLength: 1,
              style: { 
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }
            }}
            sx={{ 
              width: 56, 
              height: 56,
              '& .MuiOutlinedInput-root': {
                height: 56
              }
            }}
          />
        ))}
      </Stack>
      
      {error && (
        <Typography color="error" variant="caption" align="center" sx={{ display: 'block', mb: 1 }}>
          {error}
        </Typography>
      )}
      
      <Typography variant="body2" align="center" sx={{ mb: 2 }}>
        <Link href="#" underline="hover" color="primary.main">
          I didn't receive the code. Resend
        </Link>
      </Typography>
      
      <FormButton type="submit">
        Verify and Proceed
      </FormButton>
    </Box>
  );
};

export default VerificationForm;