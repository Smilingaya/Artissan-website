import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Chip, 
  Button,
  Grid,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentIcon from '@mui/icons-material/Payment';
import { format } from 'date-fns';

const statusColors = {
  'pending': 'warning',
  'accepted': 'info',
  'shipped': 'primary',
  'delivered': 'success',
  'cancelled': 'error'
};

const OrderItem = ({ order, onUpdateStatus, onDeleteOrder, isSellerView = false }) => {
  const navigate = useNavigate();
  const formattedDate = format(new Date(order.date), 'dd MMM yyyy');
  
  const handlePayNow = () => {
    navigate('/checkout', { state: { order } });
  };

  const renderActionButtons = () => {
    if (!isSellerView) {
      if (order.status === 'pending') {
        return (
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => onDeleteOrder(order.id)}
          >
            Delete Order
          </Button>
        );
      } else if (order.status === 'accepted' && order.paymentStatus === 'unpaid') {
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<PaymentIcon />}
            onClick={handlePayNow}
          >
            Pay Now
          </Button>
        );
      }
    }
    return null;
  };
  
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src={order.items[0].image}
              alt={order.items[0].name}
              sx={{ width: '50px', height: '50px', mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle1">
                {order.items.map(item => `${item.name} x ${item.quantity}`).join(', ')}
              </Typography>
              {order.items[0].size && (
                <Typography variant="body2" color="text.secondary">
                  {order.items.map(item => `Size: ${item.size}`).join(', ')}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                Date: {formattedDate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: ${order.total.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            height: '100%',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip 
                label={order.status.charAt(0).toUpperCase() + order.status.slice(1)} 
                color={statusColors[order.status]} 
                size="small" 
              />
              {order.paymentStatus === 'paid' ? (
                <Chip 
                  label="Paid" 
                  color="success" 
                  size="small" 
                />
              ) : (
                <Chip 
                  label="Unpaid" 
                  color="warning" 
                  size="small" 
                />
              )}
            </Box>
            
            {isSellerView && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Customer: {order.address?.name || 'N/A'}
                </Typography>
                {order.address && (
                  <Typography variant="body2" color="text.secondary">
                    Location: {order.address.city}, {order.address.country}
                  </Typography>
                )}
              </Box>
            )}
            
            {renderActionButtons()}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrderItem; 