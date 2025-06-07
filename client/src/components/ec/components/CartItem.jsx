import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  TextField,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CartContext } from '../contexts/CartContext';

const CartItem = ({ item }) => {
  const { updateCartItemQuantity, removeFromCart } = useContext(CartContext);

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity > 0) {
      updateCartItemQuantity(item.id, item.selectedSize, newQuantity);
    }
  };

  return (
    <Grid container alignItems="center" sx={{ py: 2, borderBottom: '1px solid #e0e0e0' }}>
      <Grid item xs={2}>
        <Box
          component="img"
          src={item.image}
          alt={item.name}
          sx={{ width: '100%', maxWidth: '80px', height: 'auto' }}
        />
      </Grid>
      <Grid item xs={4}>
        <Typography variant="subtitle1">{item.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          ${item.price} | Size: {item.selectedSize}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          InputProps={{ inputProps: { min: 1 } }}
          value={item.quantity}
          onChange={handleQuantityChange}
          sx={{ width: '60px' }}
        />
      </Grid>
      <Grid item xs={2}>
        <Typography variant="subtitle1">${(item.price * item.quantity).toFixed(2)}</Typography>
      </Grid>
      <Grid item xs={2} sx={{ textAlign: 'right' }}>
        <IconButton onClick={() => removeFromCart(item.id, item.selectedSize)}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default CartItem;