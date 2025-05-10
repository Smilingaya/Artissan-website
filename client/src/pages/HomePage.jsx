import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import MainLayout from '../components/homePage/layout/MainLayout';
import FeaturedBanner from '../components/homePage/home/FeaturedBanner';
import CategoryTabs from '../components/homePage/home/CategoryTabs';
import PostsGrid from '../components/homePage/home/PostsGrid';
import FeaturedCreators from '../components/homePage/home/FeaturedCreators';
import PostDetailDialog from '../components/homePage/common/PostDetailDialog';

// Import placeholder images
import post1 from '../assets/post1.jpg';
import post2 from '../assets/post2.jpg';
import post3 from '../assets/post3.jpg';
import post4 from '../assets/post4.jpg';
import profile1 from '../assets/profile.jpg';
import profile2 from '../assets/post1.jpg';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryTab, setCategoryTab] = useState(0);

  // Sample images (in a real app, these would be imported or fetched)
  const placeholderImages = {
    post1: post1,
    post2: post2,
    post3: post3,
    post4: post4,
    post5: post1,
    post6: post2,
    profile1: profile1,
    profile2: post1
  };

  // Categories
  const categories = ["All", "Jewelry", "Home Decor", "Clothing", "Accessories", "Art", "Stationery"];

  // Sample posts data
  const posts = [
    {
      _id: "1",
      title: "Beautiful Handmade Necklace",
      image: placeholderImages.post1,
      description: "A stunning handcrafted necklace made from natural gems and sterling silver. Perfect for special occasions and everyday wear.",
      price: "$85.00",
      category: "Jewelry",
      likes: 245,
      user: { name: "Ines", profilePic: placeholderImages.profile1, id: "1", followers: 1240 },
      tags: ["handmade", "jewelry", "necklace"],
      created: "2 days ago"
    },
    {
      _id: "2",
      title: "Vintage Pottery Vase",
      image: placeholderImages.post2,
      description: "Classic vintage style pottery vase with hand-painted details. Each piece is unique and shows beautiful craftsmanship.",
      price: "$120.00",
      category: "Home Decor",
      likes: 189,
      user: { name: "Aya", profilePic: placeholderImages.profile2, id: "2", followers: 3560 },
      tags: ["pottery", "vintage", "home decor"],
      created: "5 days ago"
    },
    {
      _id: "3",
      title: "Wool Knitted Scarf",
      image: placeholderImages.post3,
      description: "Soft and warm handmade scarf knitted with premium wool. Perfect for winter and available in multiple colors.",
      price: "$45.00",
      category: "Clothing",
      likes: 127,
      user: { name: "Ines", profilePic: placeholderImages.profile1, id: "1", followers: 1240 },
      tags: ["knitting", "scarf", "winter wear"],
      created: "1 week ago"
    },
    {
      _id: "4",
      title: "Custom Leather Wallet",
      image: placeholderImages.post4,
      description: "Elegant and durable leather wallet with customizable initials. Made with genuine full-grain leather that ages beautifully.",
      price: "$65.00",
      category: "Accessories",
      likes: 210,
      user: { name: "Aya", profilePic: placeholderImages.profile2, id: "2", followers: 3560 },
      tags: ["leather", "wallet", "custom"],
      created: "3 days ago"
    },
    {
      _id: "5",
      title: "Ceramic Coffee Mug Set",
      image: placeholderImages.post5,
      description: "Set of 4 handcrafted ceramic coffee mugs in earthy tones. Microwave and dishwasher safe.",
      price: "$60.00",
      category: "Home Decor",
      likes: 156,
      user: { name: "Ines", profilePic: placeholderImages.profile1, id: "1", followers: 1240 },
      tags: ["ceramic", "mugs", "kitchen"],
      created: "1 day ago"
    },
    {
      _id: "6",
      title: "Hand-woven Basket",
      image: placeholderImages.post6,
      description: "Traditional hand-woven basket made with sustainable materials. Perfect for storage or as a decorative piece.",
      price: "$75.00",
      category: "Home Decor",
      likes: 95,
      user: { name: "Aya", profilePic: placeholderImages.profile2, id: "2", followers: 3560 },
      tags: ["basket", "woven", "sustainable"],
      created: "4 days ago"
    },
  ];

  // Featured creators
  const featuredCreators = [
    { id: "1", name: "Ines", followers: 1240, profilePic: placeholderImages.profile1 },
    { id: "2", name: "Aya", followers: 3560, profilePic: placeholderImages.profile2 },
    { id: "3", name: "Marco", followers: 987, profilePic: placeholderImages.profile1 },
    { id: "4", name: "Sophia", followers: 2345, profilePic: placeholderImages.profile2 }
  ];

  const handleCategoryChange = (event, newValue) => {
    setCategoryTab(newValue);
  };

  const navigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  // Filtered posts based on category and search
  const filteredPosts = posts.filter(post => {
    const matchesCategory = categoryTab === 0 || post.category === categories[categoryTab];
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <ThemeContext>
      <MainLayout
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        categoryTab={categoryTab}
        setCategoryTab={setCategoryTab}
      >
        <FeaturedBanner />
        
        <CategoryTabs 
          categories={categories} 
          categoryTab={categoryTab} 
          handleCategoryChange={handleCategoryChange} 
        />
        
        <PostsGrid 
          posts={filteredPosts} 
          setSelectedPost={setSelectedPost} 
        />
        
        <FeaturedCreators 
          creators={featuredCreators} 
          navigateToProfile={navigateToProfile} 
        />
        
        <PostDetailDialog 
          post={selectedPost} 
          open={Boolean(selectedPost)} 
          onClose={() => setSelectedPost(null)} 
          navigateToProfile={navigateToProfile}
        />
      </MainLayout>
    </ThemeContext>
  );
};

export default HomePage;