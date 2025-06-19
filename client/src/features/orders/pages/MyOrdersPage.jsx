import React, { useEffect, useState, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import MainLayout from '../../../shared/components/layout/MainLayout';
import { UserContext } from '../../../shared/contexts/UserContext';
import OrderItem from '../components/OrderItem';
import { fetchUserOrders, deleteOrderById } from '../../profile/utils/api'; // 👈 use your actual path

const MyOrdersPage = () => {
  const { currentUser } = useContext(UserContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, orderId: null });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      if (!currentUser?._id) return;
      try {
        const data = await fetchUserOrders(currentUser._id);
setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (error) {
        console.error('Error loading orders:', error);
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

  const handleDeleteOrder = async () => {
    try {
      await deleteOrderById(deleteDialog.orderId);
      setOrders(prev => prev.filter(order => order._id !== deleteDialog.orderId));
      setSnackbar({
        open: true,
        message: 'Order deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete order',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, orderId: null });
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
    if (tabValue === 3) return ['accepted', 'shipped'].includes(order.status) && order.paymentStatus === 'paid';
    if (tabValue === 4) return order.status === 'delivered';
    if (tabValue === 5) return order.status === 'cancelled';
    return false;
  });

  if (!currentUser) {
    return (
      <MainLayout>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Please log in to view your orders
            </Typography>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Orders
        </Typography>

        <Paper elevation={0} sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="All Orders" />
            <Tab label="Pending Approval" />
            <Tab label="Need Payment" />
            <Tab label="Active Orders" />
            <Tab label="Completed" />
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
              onDeleteOrder={(id) => setDeleteDialog({ open: true, orderId: id })}
            />
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {tabValue === 0
                ? "You haven't placed any orders yet"
                : tabValue === 1
                  ? "No orders pending approval"
                  : tabValue === 2
                    ? "No orders awaiting payment"
                    : tabValue === 3
                      ? "No active orders"
                      : tabValue === 4
                        ? "No completed orders"
                        : "No cancelled orders"}
            </Typography>
          </Box>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, orderId: null })}
        >
          <DialogTitle>Delete Order</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this order? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, orderId: null })}>
              Cancel
            </Button>
            <Button onClick={handleDeleteOrder} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
};

export default MyOrdersPage;
