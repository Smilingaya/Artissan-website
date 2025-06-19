import React, { useState } from 'react';
import {
  Box, Typography, Chip, Button, Grid, Paper, Select,
  MenuItem, FormControl, InputLabel
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentIcon from '@mui/icons-material/Payment';

const statusColors = {
  pending: 'warning',
  accepted: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
};

const statusFlow = ['pending', 'accepted', 'shipped', 'delivered', 'cancelled'];

const OrderItem = ({ order, onUpdateStatus, onDeleteOrder, isSellerView = false }) => {
  const navigate = useNavigate();
  const item = order.items?.[0];
  const product = item?.product;
  const image = product?.mainImage || '';
  const name = product?.name || 'Unknown Product';
  const quantity = item?.quantity || 1;
  const total = product?.price && item?.quantity
  ? `$${(product.price * item.quantity).toFixed(2)}`
  : '$N/A';


  const artisan = product?.user;
  const customer = order?.user;

  const [localStatus, setLocalStatus] = useState(order.status);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setLocalStatus(newStatus);
    await onUpdateStatus(order._id, newStatus);
  };

  const handlePayNow = () => {
    navigate('/checkout', { state: { order } });
  };

  const renderBuyerActions = () => {
    if (order.paymentStatus === 'paid') return null;

    if (order.status === 'pending') {
      return (
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => onDeleteOrder(order._id)}
        >
          Delete Order
        </Button>
      );
    }

    if (order.status === 'accepted') {
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

    return null;
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        {/* Product Info */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src={image}
              alt={name}
              sx={{ width: 60, height: 60, mr: 2, borderRadius: 1, objectFit: 'cover' }}
            />
            <Box>
              <Typography variant="subtitle1">{name} x {quantity}</Typography>
              <Typography variant="body2" color="text.secondary">Total: {total}</Typography>
              <Typography variant="body2" color="text.secondary">
                {isSellerView ? 'Customer' : 'Artisan'}:{' '}
                {isSellerView
                  ? (customer?._id ? (
                      <Link to={`/profile/${customer._id}`}>{customer.name || 'Customer'}</Link>
                    ) : 'N/A')
                  : (artisan?._id ? (
                      <Link to={`/profile/${artisan._id}`}>{artisan.name || 'Artisan'}</Link>
                    ) : 'N/A')}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Status & Actions */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '100%',
              gap: 1,
            }}
          >
            {/* Seller view with status dropdown */}
            {isSellerView ? (
              <>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={localStatus}
                    label="Status"
                    onChange={handleStatusChange}
                    sx={{
                      fontWeight: 500,
                      color: (theme) =>
                        theme.palette[statusColors[localStatus]]?.main || theme.palette.text.primary
                    }}
                  >
                    {statusFlow.map((status) => {
                      const currentIndex = statusFlow.indexOf(order.status);
                      const nextIndex = statusFlow.indexOf(status);

                      const disableLogic =
                        nextIndex < currentIndex ||
                        (order.status === 'shipped' && status === 'cancelled');

                      return (
                        <MenuItem key={status} value={status} disabled={disableLogic}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: (theme) =>
                                  theme.palette[statusColors[status]]?.main || 'grey.400',
                                mr: 1,
                              }}
                            />
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <Chip
                  label={order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                  color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </>
            ) : (
              <>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    color={statusColors[order.status] || 'default'}
                    size="small"
                  />
                  <Chip
                    label={order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                    color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>

                {renderBuyerActions()}
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrderItem;
