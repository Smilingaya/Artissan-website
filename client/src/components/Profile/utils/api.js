// src/utils/api.js
// Note: This is a mock API. In a real app, you would make actual API calls.
import post1 from '../../../assets/post1.jpg';
import post2 from '../../../assets/post2.jpg';
import post3 from '../../../assets/post3.jpg';
import post4 from '../../../assets/post4.jpg';
import profile1 from '../../../assets/profile.jpg';
import profile2 from '../../../assets/post1.jpg';

// Mock user data
const users = [
  {
    _id: '1',
    name: 'Dr. Olivia Johnson',
    bio: 'Artisan & Professional Craftsperson | Creating unique pieces that tell a story',
    avatar: 'https://i.pravatar.cc/300',
    followers: 1234,
    following: 421,
    location: 'New York, USA',
    isOwner: true,
    isFollowing: false,
    joinedDate: '2023-01-15'
  },
  {
    _id: '2',
    name: 'Marcus Chen',
    bio: 'Ceramic Artist | Exploring forms and textures in clay',
    avatar: 'https://i.pravatar.cc/301',
    followers: 856,
    following: 234,
    location: 'San Francisco, USA',
    isOwner: false,
    isFollowing: true,
    joinedDate: '2023-03-20'
  },
  {
    _id: '3',
    name: 'Emma Wilson',
    bio: 'Jewelry Designer | Creating wearable art',
    avatar: 'https://i.pravatar.cc/302',
    followers: 2341,
    following: 567,
    location: 'London, UK',
    isOwner: false,
    isFollowing: false,
    joinedDate: '2023-02-10'
  }
];

// Mock posts data
const posts = [
  {
    _id: '1',
    title: 'New Collection',
    content: 'Check out my latest handmade collection!',
    imageUrl: 'https://picsum.photos/800/600',
    user: users[0],
    likes: 42,
    comments: [
      {
        id: 1,
        text: 'Beautiful work! Love the attention to detail.',
        user: users[1],
        timestamp: '1 hour ago'
      },
      {
        id: 2,
        text: 'Where can I purchase this?',
        user: users[2],
        timestamp: '30 minutes ago'
      }
    ],
    isLiked: false,
    timestamp: '2 hours ago'
  },
  {
    _id: '2',
    content: 'Work in progress on a new piece',
    imageUrl: 'https://picsum.photos/800/601',
    user: users[0],
    likes: 28,
    comments: [
      {
        id: 1,
        text: 'Can\'t wait to see the final result!',
        user: users[1],
        timestamp: '45 minutes ago'
      }
    ],
    isLiked: true,
    timestamp: '1 day ago'
  },
  {
    _id: '3',
    title: 'Latest Ceramic Collection',
    content: 'Excited to share my new series of ceramic vessels inspired by ocean waves.',
    imageUrl: 'https://picsum.photos/800/602',
    user: users[1],
    likes: 156,
    comments: [
      {
        id: 1,
        text: 'These are stunning! Love the wave patterns.',
        user: users[0],
        timestamp: '3 hours ago'
      }
    ],
    isLiked: false,
    timestamp: '5 hours ago'
  },
  {
    _id: '4',
    content: 'Studio day - experimenting with new glazes',
    imageUrl: 'https://picsum.photos/800/603',
    user: users[1],
    likes: 89,
    comments: [],
    isLiked: false,
    timestamp: '2 days ago'
  }
];

// Mock products data
const products = [
  {
    _id: '1',
    name: 'Handmade Ceramic Vase',
    discreption: 'Beautiful handcrafted ceramic vase with unique glaze',
    price: 89.99,
    stoke: 5,
    category: 'Home Decor',
    mainImage: 'https://picsum.photos/800/800',
    user: users[0],
    reviews: [
      {
        id: 1,
        text: 'Absolutely beautiful piece! The craftsmanship is outstanding.',
        rating: 5,
        user: users[1],
        timestamp: '2 days ago'
      },
      {
        id: 2,
        text: 'Love the unique glaze pattern. Perfect size for my space.',
        rating: 4,
        user: users[2],
        timestamp: '1 week ago'
      }
    ]
  },
  {
    _id: '2',
    name: 'Woven Wall Hanging',
    discreption: 'Modern macrame wall hanging made with natural cotton rope',
    price: 129.99,
    stoke: 3,
    category: 'Wall Art',
    mainImage: 'https://picsum.photos/800/801',
    user: users[0],
    reviews: [
      {
        id: 1,
        text: 'Exactly what I was looking for! The natural tones are perfect.',
        rating: 5,
        user: users[1],
        timestamp: '3 days ago'
      }
    ]
  },
  {
    _id: '3',
    name: 'Ocean Wave Ceramic Bowl',
    discreption: 'Hand-thrown ceramic bowl with unique wave-inspired glaze pattern',
    price: 75.99,
    stoke: 2,
    category: 'Tableware',
    mainImage: 'https://picsum.photos/800/802',
    user: users[1], // Marcus Chen
    reviews: [
      {
        id: 1,
        text: 'The glaze work is absolutely stunning!',
        rating: 5,
        user: users[0],
        timestamp: '1 day ago'
      }
    ]
  },
  {
    _id: '4',
    name: 'Crystalline Glaze Vase',
    discreption: 'Tall ceramic vase featuring stunning crystalline glaze effects',
    price: 199.99,
    stoke: 1,
    category: 'Home Decor',
    mainImage: 'https://picsum.photos/800/803',
    user: users[1], // Marcus Chen
    reviews: []
  }
];

// API Functions
export const fetchUser = async (userId) => {
  const user = users.find(u => u._id === userId) || users[0];
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(user);
    }, 500);
  });
};

export const fetchUserPosts = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userPosts = posts.filter(post => post.user._id === userId);
      resolve(userPosts);
    }, 500);
  });
};

export const fetchUserProducts = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userProducts = products.filter(product => product.user._id === userId);
      resolve(userProducts);
    }, 500);
  });
};

export const fetchAllUsers = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(users.filter(u => !u.isOwner));
    }, 500);
  });
};

export const deletePost = async (postId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

export const deleteProduct = async (productId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

export const updateProfile = async (userId, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...users[0],
        ...data
      });
    }, 500);
  });
};

// Additional helper functions
export const likePost = (postId) => {
  return Promise.resolve({ success: true });
};

export const unlikePost = (postId) => {
  return Promise.resolve({ success: true });
};

export const savePost = (postId) => {
  return Promise.resolve({ success: true });
};

export const unsavePost = (postId) => {
  return Promise.resolve({ success: true });
};

export const addComment = (postId, comment) => {
  const newComment = {
    _id: `c${Math.random().toString(36).substr(2, 9)}`,
    text: comment,
    createdAt: new Date().toISOString(),
    user: users[0]
  };
  return Promise.resolve(newComment);
};

export const deleteComment = (commentId) => {
  return Promise.resolve({ success: true });
};

export const followUser = (userId) => {
  return Promise.resolve({ success: true });
};

export const unfollowUser = (userId) => {
  return Promise.resolve({ success: true });
};