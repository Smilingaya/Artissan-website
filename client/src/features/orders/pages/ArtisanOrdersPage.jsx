import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { UserContext } from '../../../shared/contexts/UserContext';
import MainLayout from '../../../shared/components/layout/MainLayout';
import OrderItem from '../components/OrderItem';
import { fetchArtisanOrders, updateOrderStatus as updateOrderStatusAPI } from '../../profile/utils/api'; 

const ArtisanOrdersPage = () => {
  const { currentUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const loadOrders = async () => {
      if (!currentUser?._id) return;
      try {
        const data = await fetchArtisanOrders(currentUser._id);
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to load orders',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [currentUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatusAPI(orderId, newStatus);
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
                paymentStatus: newStatus === 'shipped' ? 'paid' : order.paymentStatus
              }
            : order
        )
      );
      setSnackbar({
        open: true,
        message: `Order status updated to ${newStatus}`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update order status',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const filteredOrders = orders.filter(order => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return order.status === 'pending';
    if (tabValue === 2) return order.status === 'accepted' && order.paymentStatus === 'unpaid';
    if (tabValue === 3) return order.status === 'accepted' && order.paymentStatus === 'paid';
    if (tabValue === 4) return order.status === 'shipped';
    if (tabValue === 5) return order.status === 'delivered';
    if (tabValue === 6) return order.status === 'cancelled';
    return false;
  });

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1">
            Artisan Dashboard
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Orders" />
            <Tab label="New Orders" />
            <Tab label="Awaiting Payment" />
            <Tab label="Ready to Ship" />
            <Tab label="Shipped" />
            <Tab label="Delivered" />
            <Tab label="Cancelled" />
          </Tabs>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderItem
              key={order._id}
              order={order}
              isSellerView={true}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {tabValue === 0
                ? "You don't have any orders yet"
                : tabValue === 1
                ? 'No new orders to review'
                : tabValue === 2
                ? 'No orders awaiting payment'
                : tabValue === 3
                ? 'No orders ready to ship'
                : tabValue === 4
                ? 'No orders in transit'
                : tabValue === 5
                ? 'No delivered orders'
                : 'No cancelled orders'}
            </Typography>
          </Box>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
};

export default ArtisanOrdersPage;
