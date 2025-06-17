import React, { createContext, useState, useEffect } from 'react';

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: 'Men Round Neck Pure Cotton T-shirt',
    price: 80,
    description: 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.',
    category: 'Men',
    image: 'https://via.placeholder.com/600x800',
    gallery: [
      'https://via.placeholder.com/100x150',
      'https://via.placeholder.com/100x150',
      'https://via.placeholder.com/100x150',
      'https://via.placeholder.com/100x150'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.5,
    reviews: 122,
    sku: '1001OrangeProdct'
  },
  {
    id: 2,
    name: 'Men Round Neck Pure Cotton T-shirt',
    price: 54,
    description: 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.',
    category: 'Men',
    image: 'https://via.placeholder.com/600x800/333',
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4,
    reviews: 87,
    sku: '1002BlackProduct'
  },
  {
    id: 3,
    name: 'Girls Round Neck Cotton Tops',
    price: 45,
    description: 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.',
    category: 'Women',
    image: 'https://via.placeholder.com/600x800/ffc0cb',
    sizes: ['S', 'M', 'L'],
    rating: 4.2,
    reviews: 65,
    sku: '2001PinkProduct'
  }
];

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Simulate loading products from API
    setProducts(mockProducts);
  }, []);

  const getProductById = (id) => {
    return products.find(product => product.id === parseInt(id));
  };

  const addProduct = (product) => {
    setProducts([...products, product]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  const deleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      getProductById,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};
