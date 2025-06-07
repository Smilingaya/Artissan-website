import React, { createContext, useState, useEffect } from 'react';

// Mock order data
const mockOrders = [
  {
    id: 1,
    items: [
      { id: 1, name: 'Men Round Neck Pure Cotton T-shirt', price: 80, quantity: 1, size: 'XL', image: 'https://via.placeholder.com/100x100' }
    ],
    total: 80,
    status: 'pending',
    paymentStatus: 'unpaid',
    date: '2024-08-10',
    userId: 1,
    sellerId: 2,
    address: {
      name: 'John Doe',
      street: 'Main Street',
      city: 'Bangalore',
      state: 'KA',
      zipCode: '560001',
      country: 'India'
    }
  },
  {
    id: 2,
    items: [
      { id: 1, name: 'Men Round Neck Pure Cotton T-shirt', price: 80, quantity: 1, size: 'S', image: 'https://via.placeholder.com/100x100' }
    ],
    total: 80,
    status: 'accepted',
    paymentStatus: 'unpaid',
    date: '2024-08-10',
    userId: 1,
    sellerId: 2,
    address: {
      name: 'John Doe',
      street: 'Main Street',
      city: 'Bangalore',
      state: 'KA',
      zipCode: '560001',
      country: 'India'
    }
  },
  {
    id: 3,
    items: [
      { id: 1, name: 'Men Round Neck Pure Cotton T-shirt', price: 80, quantity: 2, size: 'M', image: 'https://via.placeholder.com/100x100' }
    ],
    total: 160,
    status: 'shipped',
    paymentStatus: 'paid',
    date: '2024-08-10',
    userId: 1,
    sellerId: 2,
    address: {
      name: 'John Doe',
      street: 'Main Street',
      city: 'Bangalore',
      state: 'KA',
      zipCode: '560001',
      country: 'India'
    }
  },
  {
    id: 4,
    items: [
      { id: 3, name: 'Girls Round Neck Cotton Tops', price: 45, quantity: 1, size: 'M', image: 'https://via.placeholder.com/100x100' }
    ],
    total: 45,
    status: 'delivered',
    paymentStatus: 'paid',
    date: '2024-07-25',
    userId: 1,
    sellerId: 2,
    address: {
      name: 'John Doe',
      street: 'Main Street',
      city: 'Bangalore',
      state: 'KA',
      zipCode: '560001',
      country: 'India'
    }
  }
];

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Simulate loading orders from API
    setOrders(mockOrders);
  }, []);

  const createOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      paymentStatus: 'unpaid'
    };
    
    setOrders(prevOrders => [...prevOrders, newOrder]);
    return newOrder;
  };

  const getUserOrders = (userId) => {
    return orders.filter(order => order.userId === userId);
  };

  const getSellerOrders = (sellerId) => {
    return orders.filter(order => order.sellerId === sellerId);
  };

  const deleteOrder = async (orderId) => {
    try {
      // In a real app, you would make an API call here
      // await api.delete(`/orders/${orderId}`);
      
      // Only allow deletion of pending orders
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      
      if (order.status !== 'pending') {
        throw new Error('Only pending orders can be deleted');
      }
      
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      // In a real app, you would make an API call here
      // await api.patch(`/orders/${orderId}/status`, { status });
      
      setOrders(prevOrders => prevOrders.map(order => {
        if (order.id === orderId) {
          const updates = { status };
          
          // Auto-update payment status based on order status
          if (status === 'shipped') {
            updates.paymentStatus = 'paid';
          }
          
          // Prevent invalid status transitions
          if (order.status === 'delivered' || 
              (order.status === 'shipped' && status === 'pending') ||
              (order.status === 'cancelled' && status !== 'cancelled')) {
            throw new Error('Invalid status transition');
          }
          
          return { ...order, ...updates };
        }
        return order;
      }));
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      // In a real app, you would make an API call here
      // await api.patch(`/orders/${orderId}/payment`, { paymentStatus });
      
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId ? { ...order, paymentStatus } : order
      ));
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      createOrder, 
      getUserOrders, 
      getSellerOrders,
      updateOrderStatus,
      updatePaymentStatus,
      deleteOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};