import React, { useState, useContext } from 'react';
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
import { OrderContext } from '../contexts/OrderContext';
import { UserContext } from '../contexts/UserContext';
import MainLayout from '../components/shared/layout/MainLayout';

const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createOrder, updatePaymentStatus } = useContext(OrderContext);
  const { currentUser } = useContext(UserContext);
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const order = location.state?.order;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePlaceOrder = async () => {
    if (!order) {
      // Create a new order if there isn't one
      const orderData = {
        items: [],  // You'll need to populate this with actual items
        payment: paymentMethod,
        userId: currentUser?.id,
        address: shippingAddress
      };
      await createOrder(orderData);
    } else {
      // Update existing order
      await updatePaymentStatus(order.id, 'paid');
    }
    navigate('/my-orders');
  };

  // Validate the current step
  const validateCurrentStep = () => {
    if (activeStep === 0) {
      return Object.values(shippingAddress).every(value => value.trim() !== '');
    }
    return true;
  };

  const renderAddressForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Full Name"
          name="name"
          value={shippingAddress.name}
          onChange={handleAddressChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Street Address"
          name="street"
          value={shippingAddress.street}
          onChange={handleAddressChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="City"
          name="city"
          value={shippingAddress.city}
          onChange={handleAddressChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="State/Province"
          name="state"
          value={shippingAddress.state}
          onChange={handleAddressChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="ZIP / Postal Code"
          name="zipCode"
          value={shippingAddress.zipCode}
          onChange={handleAddressChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Country"
          name="country"
          value={shippingAddress.country}
          onChange={handleAddressChange}
        />
      </Grid>
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
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      {order ? (
        <>
          {order.items.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Grid container>
                <Grid item xs={8}>
                  <Typography>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                </Grid>
                <Grid item xs={4} textAlign="right">
                  <Typography>${item.price * item.quantity}</Typography>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Grid container>
            <Grid item xs={8}>
              <Typography variant="subtitle1">Total</Typography>
            </Grid>
            <Grid item xs={4} textAlign="right">
              <Typography variant="subtitle1">${order.total}</Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        <Alert severity="info">
          No items in order yet. Please add items before proceeding.
        </Alert>
      )}
    </Box>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return renderAddressForm();
      case 1:
        return renderPaymentForm();
      case 2:
        return renderOrderSummary();
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography component="h1" variant="h4" align="center" sx={{ mb: 4 }}>
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {renderStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNext}
              disabled={!validateCurrentStep()}
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
