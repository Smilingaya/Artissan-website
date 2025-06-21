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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DownloadIcon from '@mui/icons-material/Download';

const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    name: '', street: '', city: '', state: '', country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [flipped, setFlipped] = useState(false);

  const order = location.state?.order;

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

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

  const handleDownloadPDF = async () => {
    const input = document.getElementById('invoice');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save('Order_Ticket.pdf');
  };
  const renderAddressForm = () => (
    <Grid container spacing={3}>
      {['name', 'street', 'city', 'state', 'country'].map((field, i) => (
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
    <Box>
      <FormControl component="fieldset">
        <FormLabel component="legend">Payment Method</FormLabel>
        <RadioGroup
          row
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel value="card" control={<Radio />} label="Credit Card" />
          <FormControlLabel value="cash" control={<Radio />} label="Cash" />
        </RadioGroup>
      </FormControl>

      {paymentMethod === 'card' && (
        <>
          <Box sx={{ perspective: '1000px', width: '100%', maxWidth: 400, mt: 4, mb: 2 }}>
            <Box sx={{
              width: '100%', height: 200, position: 'relative',
              transformStyle: 'preserve-3d', transition: 'transform 0.8s',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>
              <Box sx={{
                position: 'absolute', width: '100%', height: '100%', bgcolor: '#002B5B',
                borderRadius: 1, backfaceVisibility: 'hidden', color: 'gold', p: 2,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}>
                <Typography sx={{ fontSize: 20 }}>الذهبية</Typography>
                <Box sx={{ fontSize: 24, letterSpacing: 2 }}>{cardNumber.replace(/\d{4}(?=.)/g, '$& ')}</Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontSize: 10 }}>CARD HOLDER</Typography>
                    <Typography>{cardHolder || 'DDDD'}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 10 }}>EXPIRES</Typography>
                    <Typography>{expiry || 'MM/YY'}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{
                position: 'absolute', width: '100%', height: '100%', bgcolor: '#001f3f',
                borderRadius: 1, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
                color: 'white', p: 2
              }}>
                <Box sx={{ mt: 6 }}>
                  <Typography variant="body2">CVV</Typography>
                  <Box sx={{ backgroundColor: 'white', color: 'black', p: 1, width: '100%', textAlign: 'center', mt: 1 }}>{cvv || '***'}</Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <TextField fullWidth label="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/[^\d]/g, '').slice(0, 16))} sx={{ mt: 2 }} />
          <TextField fullWidth label="Card Holder Name" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} sx={{ mt: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField label="Expiry (MM/YY)" value={expiry} onChange={(e) => setExpiry(e.target.value)} sx={{ flex: 1 }} />
            <TextField label="CVV" value={cvv} onFocus={() => setFlipped(true)} onBlur={() => setFlipped(false)} onChange={(e) => setCvv(e.target.value.slice(0, 3))} sx={{ flex: 1 }} />
          </Box>
        </>
      )}

      {paymentMethod === 'cash' && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1">You’ll pay in cash on delivery. Please prepare the exact amount.</Typography>
        </Box>
      )}
    </Box>
  );

  const renderOrderSummary = () => (
    <Box id="invoice">
      <Typography variant="h6" gutterBottom>Order Summary</Typography>
      {order ? (
        <>
          {order.items.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Grid container>
                <Grid item xs={8}>
                  <Typography>{item.product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Quantity: {item.quantity}</Typography>
                </Grid>
                <Grid item xs={4} textAlign="right">
                  <Typography> {item.product.price * item.quantity} DA</Typography>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Grid container>
            <Grid item xs={8}><Typography variant="subtitle1">Total</Typography></Grid>
            <Grid item xs={4} textAlign="right"><Typography variant="subtitle1">${order.totalPrice}</Typography></Grid>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            {activeStep === steps.length - 1 && (
              <Button variant="outlined" onClick={handleDownloadPDF} startIcon={<DownloadIcon />}>Download Ticket</Button>
            )}
            <Box>
              {activeStep !== 0 && <Button onClick={handleBack} sx={{ mr: 1 }}>Back</Button>}
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNext}
                disabled={activeStep === 0 && !Object.values(shippingAddress).every(v => v.trim())}
              >
                {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default CheckoutPage;
