/*import api from './api';

export const getUserOrders = async (userId) => {
  return api.get(`/orders/user/${userId}`);
};

export const getArtisanOrders = async (artisanId) => {
  return api.get(`/orders/artisan/${artisanId}`);
};

export const getOrderById = async (orderId) => {
  return api.get(`/orders/${orderId}`);
};

export const addToCart = async (cartItem) => {
  return api.post('/cart', cartItem);
};

export const updateOrderStatus = async (orderId, status) => {
  return api.patch(`/orders/${orderId}/status`, { status });
};

export const cancelOrder = async (orderId) => {
  return api.patch(`/orders/${orderId}/cancel`);
};*/
export const getUserOrders = async (userId) => {
  return [
    {
      id: "order1",
      userId,
      items: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 }
      ],
      total: 90,
      status: "pending"
    }
  ];
};

export const getArtisanOrders = async (artisanId) => {
  return [
    {
      id: "order2",
      artisanId,
      items: [
        { productId: 1, quantity: 1 }
      ],
      total: 25,
      status: "shipped"
    }
  ];
};

export const getOrderById = async (orderId) => {
  const allOrders = await getUserOrders("mockUser");
  return allOrders.find((order) => order.id === orderId);
};

export const addToCart = async (cartItem) => {
  console.log("Mock add to cart:", cartItem);
  return { ...cartItem, added: true };
};

export const updateOrderStatus = async (orderId, status) => {
  console.log(`Mock update order ${orderId} to status: ${status}`);
  return { id: orderId, status };
};

export const cancelOrder = async (orderId) => {
  console.log(`Mock cancel order: ${orderId}`);
  return { id: orderId, status: "cancelled" };
};
