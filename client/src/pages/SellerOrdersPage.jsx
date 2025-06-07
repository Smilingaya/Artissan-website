import React, { useContext, useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { OrderContext } from '../components/ec/contexts/OrderContext';
import { UserContext } from '../components/ec/contexts/UserContext';
import OrderItem from '../components/ec/components/OrderItem';
import AddProductForm from '../components/ec/components/AddProductForm';
import MainLayout from '../components/shared/layout/MainLayout';

const SellerOrdersPage = () => {
  const { getSellerOrders, updateOrderStatus } = useContext(OrderContext);
  const { currentUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // For demo purposes, we're using a hardcoded seller ID
      const sellerOrders = getSellerOrders(2);
      setOrders(sellerOrders);
    }
  }, [currentUser, getSellerOrders]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUpdateStatus = (orderId, status) => {
    updateOrderStatus(orderId, status);
    // Re-fetch orders to reflect changes
    if (currentUser) {
      const sellerOrders = getSellerOrders(2);
      setOrders(sellerOrders);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Seller Dashboard
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add New Product
          </Button>
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

        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderItem 
              key={order.id} 
              order={order} 
              isSeller={true}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {tabValue === 0 
                ? "You don't have any orders yet" 
                : tabValue === 1 
                  ? "No new orders" 
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

        {/* Add Product Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogContent>
            <AddProductForm />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleCloseDialog}>Save Product</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};

export default SellerOrdersPage;