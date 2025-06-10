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
import { OrderContext } from '../contexts/OrderContext';
import { UserContext } from '../contexts/UserContext';
import OrderItem from '../components/ec/components/OrderItem';
import MainLayout from '../components/shared/layout/MainLayout';

const ArtisanOrdersPage = () => {
  const { getSellerOrders, updateOrderStatus } = useContext(OrderContext);
  const { currentUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const loadOrders = () => {
    if (currentUser && currentUser.id) {
      console.log('Loading orders for seller:', currentUser.id);
      const sellerOrders = getSellerOrders(currentUser.id);
      console.log('Found seller orders:', sellerOrders);
      setOrders(sellerOrders);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [currentUser, getSellerOrders]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Update the order status in the local state immediately
      setOrders(prevOrders => prevOrders.map(order => {
        if (order.id === orderId) {
          const updates = { status: newStatus };
          // Auto-update payment status if marking as shipped
          if (newStatus === 'shipped') {
            updates.paymentStatus = 'paid';
          }
          return { ...order, ...updates };
        }
        return order;
      }));

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

  // Filter orders based on selected tab
  const filteredOrders = orders.filter(order => {
    if (tabValue === 0) return true; // All orders
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
              key={order.id} 
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
                  ? "No new orders to review" 
                  : tabValue === 2
                    ? "No orders awaiting payment"
                    : tabValue === 3
                      ? "No orders ready to ship"
                      : tabValue === 4
                        ? "No orders in transit"
                        : tabValue === 5
                          ? "No delivered orders"
                          : "No cancelled orders"}
            </Typography>
          </Box>
        )}

        {/* Status Update Snackbar */}
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