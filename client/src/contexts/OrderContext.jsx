import React, { createContext, useState, useEffect } from 'react';

// Mock order data
const mockOrders = [
  {
    id: 1,
    items: [
      { id: 1, name: 'Handmade Ceramic Vase', price: 80, quantity: 1, image: 'https://via.placeholder.com/100x100' }
    ],
    total: 80,
    status: 'pending',
    paymentStatus: 'unpaid',
    date: '2024-03-10',
    userId: 1,
    sellerId: 2,
    customer: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    address: {
      name: 'John Doe',
      street: 'Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    id: 2,
    items: [
      { id: 2, name: 'Woven Basket', price: 45, quantity: 2, image: 'https://via.placeholder.com/100x100' }
    ],
    total: 90,
    status: 'accepted',
    paymentStatus: 'paid',
    date: '2024-03-09',
    userId: 1,
    sellerId: 2,
    customer: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    address: {
      name: 'John Doe',
      street: 'Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    id: 3,
    items: [
      { id: 3, name: 'Handmade Soap Set', price: 25, quantity: 3, image: 'https://via.placeholder.com/100x100' }
    ],
    total: 75,
    status: 'shipped',
    paymentStatus: 'paid',
    date: '2024-03-08',
    userId: 1,
    sellerId: 1,
    customer: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    address: {
      name: 'John Doe',
      street: 'Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  // Adding new orders where user 1 is the seller
  {
    id: 4,
    items: [
      { id: 4, name: 'Artisan Coffee Mug', price: 35, quantity: 2, image: 'https://via.placeholder.com/100x100' }
    ],
    total: 70,
    status: 'pending',
    paymentStatus: 'unpaid',
    date: '2024-03-11',
    userId: 2,
    sellerId: 1,
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    address: {
      name: 'Jane Smith',
      street: 'Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    }
  },
  {
    id: 5,
    items: [
      { id: 5, name: 'Handwoven Scarf', price: 55, quantity: 1, image: 'https://via.placeholder.com/100x100' }
    ],
    total: 55,
    status: 'accepted',
    paymentStatus: 'paid',
    date: '2024-03-10',
    userId: 3,
    sellerId: 1,
    customer: {
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    address: {
      name: 'Mike Johnson',
      street: 'Pine Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    }
  },
  {
    id: 6,
    items: [
      { id: 6, name: 'Pottery Bowl Set', price: 120, quantity: 1, image: 'https://via.placeholder.com/100x100' }
    ],
    total: 120,
    status: 'shipped',
    paymentStatus: 'paid',
    date: '2024-03-09',
    userId: 4,
    sellerId: 1,
    customer: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com'
    },
    address: {
      name: 'Sarah Wilson',
      street: 'Maple Drive',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
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
      setOrders(prevOrders => prevOrders.map(order => {
        if (order.id === orderId) {
          const updates = { status };
          
          if (status === 'shipped') {
            updates.paymentStatus = 'paid';
          }
          
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