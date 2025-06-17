export const mockPosts = [
  {
    id: 1,
    user: {
      id: 1,
      name: "Sarah Chen",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    content: "Just finished a new ceramic collection! 🎨",
    images: ["https://picsum.photos/400/300"],
    likes: 24,
    comments: 5,
    timestamp: "2h ago",
    isLiked: false
  },
  {
    id: 2,
    user: {
      id: 2,
      name: "Marcus Rodriguez",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    content: "New recipe development in progress! 🍳",
    images: ["https://picsum.photos/400/301"],
    likes: 18,
    comments: 3,
    timestamp: "4h ago",
    isLiked: true
  }
];

export const mockProducts = [
  {
    id: 1,
    name: "Handmade Ceramic Vase",
    description: "Beautiful handcrafted ceramic vase with unique glaze",
    price: 89.99,
    category: "Home & Decor",
    image: "https://picsum.photos/400/400",
    artisan: {
      id: 1,
      name: "Sarah Chen",
      rating: 4.8
    }
  },
  {
    id: 2,
    name: "Artisanal Chocolate Box",
    description: "Assorted handmade chocolates with unique flavors",
    price: 34.99,
    category: "Food & Beverages",
    image: "https://picsum.photos/400/401",
    artisan: {
      id: 2,
      name: "Marcus Rodriguez",
      rating: 4.9
    }
  }
]; 