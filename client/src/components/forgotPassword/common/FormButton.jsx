import React from 'react';
import { Button } from '@mui/material';

const FormButton = ({ children, ...props }) => {
  return (
    <Button 
      fullWidth 
      variant="contained" 
      color="primary"
      disableElevation
      sx={{ 
        backgroundColor: 'rgba(94, 53, 177, 0.5)', // light glass purple
        backdropFilter: 'blur(10px)',
        color: 'white',
        p: 2,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        height: 48,
        fontSize: '1rem',
        fontWeight: 500,
        my: 2
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default FormButton;