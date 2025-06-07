import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Divider, 
  Paper,
  Grid
} from '@mui/material';
import CartItem from '../components/ec/components/CartItem';
import { CartContext } from '../components/ec/contexts/CartContext';
import MainLayout from '../components/shared/layout/MainLayout';

const CartPage = () => {
  const { cart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();
  
  const cartTotal = getCartTotal();
  const shippingCost = cartTotal > 50 ? 0 : 5;
  const finalTotal = cartTotal + shippingCost;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart
        </Typography>
        
        {cart.length > 0 ? (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</Typography>
                  <Typography variant="h6">Subtotal</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                {cart.map(item => (
                  <CartItem key={`${item.id}-${item.selectedSize}`} item={item} />
                ))}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1">${cartTotal.toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Shipping</Typography>
                  <Typography variant="body1">
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">${finalTotal.toFixed(2)}</Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Free shipping on orders over $50
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Looks like you haven't added any items to your cart yet.
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/"
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Box>
        )}
      </Container>
    </MainLayout>
  );
};

export default CartPage;
