// Mock data for development and testing

export const mockPosts = [
  {
    id: 1,
    user: {
      id: 1,
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/50'
    },
    title: 'Handcrafted Leather Wallet',
    content: 'Just finished this custom leather wallet. What do you think?',
    image: 'https://via.placeholder.com/500',
    likes: 24,
    comments: 5,
    isLiked: false,
    category: 'Leather'
  },
  {
    id: 2,
    user: {
      id: 2,
      name: 'Jane Smith',
      avatar: 'https://via.placeholder.com/50'
    },
    title: 'Ceramic Vase Collection',
    content: 'New collection of hand-painted ceramic vases',
    image: 'https://via.placeholder.com/500',
    likes: 45,
    comments: 8,
    isLiked: false,
    category: 'Ceramics'
  },
  {
    id: 3,
    user: {
      id: 3,
      name: 'Mike Wilson',
      avatar: 'https://via.placeholder.com/50'
    },
    title: 'Wooden Coffee Table',
    content: 'Custom-made coffee table with epoxy resin inlay',
    image: 'https://via.placeholder.com/500',
    likes: 67,
    comments: 12,
    isLiked: false,
    category: 'Woodworking'
  }
];

export const mockProducts = [
  {
    id: 1,
    name: 'Handcrafted Leather Wallet',
    description: 'Genuine leather wallet, hand-stitched with premium materials',
    price: 79.99,
    image: 'https://via.placeholder.com/300',
    category: 'Leather',
    seller: {
      id: 1,
      name: 'John Doe',
      rating: 4.8
    },
    stock: 5
  },
  {
    id: 2,
    name: 'Ceramic Flower Vase',
    description: 'Hand-painted ceramic vase with unique floral design',
    price: 129.99,
    image: 'https://via.placeholder.com/300',
    category: 'Ceramics',
    seller: {
      id: 2,
      name: 'Jane Smith',
      rating: 4.9
    },
    stock: 3
  },
  {
    id: 3,
    name: 'Wooden Coffee Table',
    description: 'Handmade coffee table with epoxy resin river design',
    price: 599.99,
    image: 'https://via.placeholder.com/300',
    category: 'Woodworking',
    seller: {
      id: 3,
      name: 'Mike Wilson',
      rating: 4.7
    },
    stock: 1
  }
]; 