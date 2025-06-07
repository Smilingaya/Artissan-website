import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Chip, 
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';

const statusColors = {
  'pending': 'warning',
  'accepted': 'info',
  'shipped': 'primary',
  'delivered': 'success',
  'cancelled': 'error'
};

// Define valid status transitions and their conditions
const getValidStatuses = (currentStatus, paymentStatus) => {
  const statuses = [
    { value: 'pending', label: 'Pending', disabled: currentStatus !== 'pending' },
    { value: 'accepted', label: 'Accepted', disabled: currentStatus !== 'pending' },
    { value: 'shipped', label: 'Shipped', disabled: currentStatus !== 'accepted' || paymentStatus !== 'paid' },
    { value: 'delivered', label: 'Delivered', disabled: currentStatus !== 'shipped' },
    { value: 'cancelled', label: 'Cancelled', disabled: currentStatus !== 'pending' }
  ];

  return statuses;
};

const OrderItem = ({ order, isSellerView = false, onUpdateStatus, onDeleteOrder }) => {
  const navigate = useNavigate();
  const formattedDate = format(new Date(order.date), 'dd MMM yyyy');
  
  const handleStatusChange = (event) => {
    onUpdateStatus(order.id, event.target.value);
  };

  const handlePayNow = () => {
    navigate('/checkout', { state: { order } });
  };

  const renderStatusSelect = () => {
    if (!isSellerView) return null;

    const validStatuses = getValidStatuses(order.status, order.paymentStatus);

    return (
      <FormControl size="small" sx={{ minWidth: 150, mt: 1 }}>
        <InputLabel id={`status-select-label-${order.id}`}>Status</InputLabel>
        <Select
          labelId={`status-select-label-${order.id}`}
          id={`status-select-${order.id}`}
          value={order.status}
          label="Status"
          onChange={handleStatusChange}
        >
          {validStatuses.map(status => (
            <MenuItem 
              key={status.value} 
              value={status.value}
              disabled={status.disabled}
            >
              {status.disabled ? (
                <Tooltip title={getDisabledReason(status.value, order)} arrow placement="right">
                  <span style={{ display: 'block', width: '100%' }}>
                    {status.label}
                  </span>
                </Tooltip>
              ) : (
                status.label
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const getDisabledReason = (status, order) => {
    switch (status) {
      case 'pending':
        return 'Cannot revert to pending status';
      case 'accepted':
        return order.status !== 'pending' ? 'Order has already been processed' : '';
      case 'shipped':
        return order.status !== 'accepted' 
          ? 'Order must be accepted first' 
          : order.paymentStatus !== 'paid' 
            ? 'Payment required before shipping' 
            : '';
      case 'delivered':
        return order.status !== 'shipped' ? 'Order must be shipped first' : '';
      case 'cancelled':
        return order.status !== 'pending'
          ? 'Cannot cancel order after it has been accepted' 
          : '';
      default:
        return '';
    }
  };
  
  const renderActionButtons = () => {
    if (!isSellerView) {
      // User view
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
        <Grid flex={isSellerView ? 8 : 6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="https://placehold.co/100x100"
              alt={order.items[0].name}
              sx={{ width: '50px', height: '50px', mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle1">
                {order.items.map(item => `${item.name} x ${item.quantity}`).join(', ')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.items.map(item => `Size: ${item.size}`).join(', ')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {formattedDate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: ${order.total.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        <Grid flex={isSellerView ? 4 : 6}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: isSellerView ? 'flex-end' : 'flex-start', 
            justifyContent: 'center' 
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
              ) : order.status === 'accepted' && (
                <Chip 
                  label="Awaiting Payment" 
                  color="warning" 
                  size="small" 
                />
              )}
            </Box>
            
            {renderStatusSelect()}
            {renderActionButtons()}
            
            {isSellerView && (
              <>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Shipping to: {order.address.name}, {order.address.city}
                </Typography>
                {order.status === 'accepted' && order.paymentStatus !== 'paid' && (
                  <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                    Waiting for customer payment before shipping
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrderItem;