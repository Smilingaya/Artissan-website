import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Grid,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Alert
} from '@mui/material';
import MainLayout from '../../../shared/components/layout/MainLayout';

const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    name: '', street: '', city: '', state: '', zipCode: '', country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const order = location.state?.order;
  console.log('Order ID being sent to update:', order._id);

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

const handlePlaceOrder = async () => {
  try {
    if (!order) return;
    await fetch(`http://localhost:3000/api/order/update/${order._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ paymentStatus: 'paid' })
    });
    navigate('/my-orders');
  } catch (err) {
    console.error('Error placing order:', err);
  }
};


  const renderAddressForm = () => (
    <Grid container spacing={3}>
      {['name', 'street', 'city', 'state', 'zipCode', 'country'].map((field, i) => (
        <Grid item xs={12} sm={i >= 2 ? 6 : 12} key={field}>
          <TextField
            required
            fullWidth
            label={field.replace(/([A-Z])/g, ' $1')}
            name={field}
            value={shippingAddress[field]}
            onChange={handleAddressChange}
          />
        </Grid>
      ))}
    </Grid>
  );

  const renderPaymentForm = () => (
    <FormControl component="fieldset">
      <FormLabel component="legend">Payment Method</FormLabel>
      <RadioGroup
        aria-label="payment-method"
        name="payment-method"
        value={paymentMethod}
        onChange={handlePaymentMethodChange}
      >
        <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
        <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
        <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
      </RadioGroup>
    </FormControl>
  );

  const renderOrderSummary = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Order Summary</Typography>
      {order ? (
        <>
          {order.items.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Grid container>
                <Grid item xs={8}>
                  <Typography>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Quantity: {item.quantity}</Typography>
                </Grid>
                <Grid item xs={4} textAlign="right">
                  <Typography>${item.price * item.quantity}</Typography>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Grid container>
            <Grid item xs={8}><Typography variant="subtitle1">Total</Typography></Grid>
            <Grid item xs={4} textAlign="right"><Typography variant="subtitle1">${order.total}</Typography></Grid>
          </Grid>
        </>
      ) : (
        <Alert severity="info">No items in order yet. Please add items before proceeding.</Alert>
      )}
    </Box>
  );

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography component="h1" variant="h4" align="center" sx={{ mb: 4 }}>Checkout</Typography>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
          </Stepper>
          {activeStep === 0 && renderAddressForm()}
          {activeStep === 1 && renderPaymentForm()}
          {activeStep === 2 && renderOrderSummary()}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && <Button onClick={handleBack} sx={{ mr: 1 }}>Back</Button>}
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNext}
              disabled={activeStep === 0 && !Object.values(shippingAddress).every(v => v.trim())}
            >
              {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default CheckoutPage;
