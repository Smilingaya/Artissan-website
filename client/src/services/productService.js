/*import api from './api';

export const getAllProducts = async (params = {}) => {
  return api.get('/products', { params });
};

export const getProductById = async (productId) => {
  return api.get(`/products/${productId}`);
};

export const getProductsByArtisan = async (artisanId) => {
  return api.get(`/products/artisan/${artisanId}`);
};

export const createProduct = async (productData) => {
  return api.post('/products', productData);
};

export const updateProduct = async (productId, productData) => {
  return api.put(`/products/${productId}`, productData);
};

export const deleteProduct = async (productId) => {
  return api.delete(`/products/${productId}`);
};
*/
export const getAllProducts = async (params = {}) => {
  return [
    {
      id: 1,
      name: "Handmade Mug",
      price: 25,
      description: "A beautiful ceramic mug",
      imageUrl: "/images/mug.jpg",
      artisanId: "artisan123"
    },
    {
      id: 2,
      name: "Wool Scarf",
      price: 40,
      description: "Warm and cozy scarf",
      imageUrl: "/images/scarf.jpg",
      artisanId: "artisan456"
    }
  ];
};

export const getProductById = async (productId) => {
  const products = await getAllProducts();
  return products.find((p) => p.id === productId);
};

export const getProductsByArtisan = async (artisanId) => {
  const products = await getAllProducts();
  return products.filter((p) => p.artisanId === artisanId);
};

export const createProduct = async (productData) => {
  console.log("Mock create product:", productData);
  return { ...productData, id: Date.now() };
};

export const updateProduct = async (productId, productData) => {
  console.log(`Mock update product ${productId}:`, productData);
  return { id: productId, ...productData };
};

export const deleteProduct = async (productId) => {
  console.log(`Mock delete product with id: ${productId}`);
  return { success: true };
};
