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
        background:  "linear-gradient(135deg,rgb(246, 255, 194) 0%,rgb(169, 171, 255) 100%)",
        color: 'white',
        '&:hover': {
          background:  "linear-gradient(135deg,rgb(246, 255, 194) 0%,rgb(169, 171, 255) 100%)",
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