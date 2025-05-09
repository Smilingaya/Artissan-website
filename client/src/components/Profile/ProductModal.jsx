import React from 'react';
import { Modal, Box, Typography, Button, Avatar } from '@mui/material';

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{ width: 500, p: 3, margin: 'auto', bgcolor: 'background.paper', borderRadius: 2 }}>
        <Button onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>×</Button>
        <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
        <Typography variant="h5" mt={2}>{product.name}</Typography>
        <Typography variant="body2" color="textSecondary">${product.price}</Typography>
        <Typography variant="body1" mt={2}>{product.description}</Typography>
      </Box>
    </Modal>
  );
};

export default ProductModal;
