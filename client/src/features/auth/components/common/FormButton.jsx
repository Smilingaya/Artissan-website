import React from 'react';
import { Button } from '@mui/material';

const FormButton = ({ children, ...props }) => {
  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      size="large"
      sx={{
        mt: 2,
        py: 1.5,
        bgcolor: 'primary.main',
        color: 'white',
        '&:hover': {
          bgcolor: 'primary.dark',
        },
        borderRadius: 2,
        textTransform: 'none',
        fontSize: '1rem',
        fontWeight: 500
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default FormButton; 