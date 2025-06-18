// src/features/home/pages/HP.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { GridView, ViewList } from "@mui/icons-material";
import SideDrawer from "../../../shared/components/layout/SideDrawer";
import AppHeader from "../../../shared/components/layout/AppHeader";
import PostCard from "../../../shared/components/posts/PostCard";
import ProductCard from "../../../shared/components/products/ProductCard";
import PostDialog from "../../../shared/components/posts/PostDialog";
import ProductDialog from "../../../shared/components/products/ProductDialog";
import SearchBar from "../../../shared/components/common/SearchBar";
import {
  fetchRecommendedPosts,
  searchPosts,
  fetchAllProducts,
  searchProducts,
  fetchProductsByCategory,
  fetchUserPosts,
  fetchAllPosts,
} from "../../../features/profile/utils/api";
import { standardizePostsArray } from "../../../shared/utils/dataTransformers";

const Homepage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryTab, setCategoryTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setShowProducts(value.length > 0);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowProducts(category.length > 0);
  };

  const handleSidebarToggle = (open) => {
    setSidebarOpen(open);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleClosePostDialog = () => {
    setSelectedPost(null);
  };

  const handleCloseProductDialog = () => {
    setSelectedProduct(null);
  };

  // Fetch recommended posts on mount (no products)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        let recommendedPosts = [];
        if (userId) {
          recommendedPosts = await fetchRecommendedPosts(userId);
        }
        // Fallback: if no recommendations, fetch all posts from all users
        if (!recommendedPosts || recommendedPosts.length === 0) {
          const allPosts = await fetchAllPosts();
          setPosts(allPosts || []);
        } else {
          setPosts(recommendedPosts || []);
        }
        setProducts([]); // No products by default
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Search and filter logic for products
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm) {
        // Search posts
        const foundPosts = await searchPosts(searchTerm);
        setPosts(foundPosts || []);
        // Search products
        const foundProducts = await searchProducts(searchTerm);
        setProducts(foundProducts || []);
      } else if (selectedCategory) {
        // Filter products by category
        const filteredProducts = await fetchProductsByCategory(
          selectedCategory
        );
        setProducts(filteredProducts || []);
      } else {
        // No products if not searching or filtering
        setProducts([]);
        // Default: fetch recommended posts
        const userId = localStorage.getItem("userId");
        let recommendedPosts = [];
        if (userId) {
          recommendedPosts = await fetchRecommendedPosts(userId);
        }
        setPosts(recommendedPosts || []);
      }
    };
    fetchSearchResults();
  }, [searchTerm, selectedCategory]);

  // Filter posts based on search and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = searchTerm
      ? (post.content || post.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        post.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesCategory = selectedCategory
      ? post.category?.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    return matchesSearch && matchesCategory;
  });

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesCategory = selectedCategory
      ? product.category.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter chips
  const categories = [
    ...new Set([
      ...posts.map((post) => post.category).filter(Boolean),
      ...products.map((product) => product.category),
    ]),
  ].filter(Boolean); // Remove any undefined/null values

  return (
    <>
      <AppHeader />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        {/* Sidebar */}
        <SideDrawer
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            paddingLeft: { xs: 0, sm: "96px" },
            paddingTop: "64px",
            transition: "padding-left 0.3s ease",
          }}
        >
          {/* Search Bar */}
          <Box sx={{ padding: "20px", paddingBottom: "10px" }}>
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search posts and products..."
            />
          </Box>

          {/* Category Filter Chips */}
          <Box
            sx={{
              padding: "0 20px 20px",
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip
              key="all"
              label="All"
              onClick={() => {
                setSelectedCategory("");
                setShowProducts(false);
              }}
              color={selectedCategory === "" ? "primary" : "default"}
              variant={selectedCategory === "" ? "filled" : "outlined"}
            />
            {categories.map((category, index) => (
              <Chip
                key={`${category}-${index}`}
                label={category}
                onClick={() => handleCategorySelect(category)}
                color={selectedCategory === category ? "primary" : "default"}
                variant={selectedCategory === category ? "filled" : "outlined"}
              />
            ))}
          </Box>

          {/* Content Area */}
          <Box sx={{ padding: "0 20px 20px" }}>
            {/* Products Section */}
            {showProducts && filteredProducts.length > 0 && (
              <Box sx={{ marginBottom: "30px" }}>
                <Box
                  sx={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "15px",
                    color: "text.primary",
                  }}
                >
                  Products ({filteredProducts.length})
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 2,
                  }}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id || `product-${product.id}`}
                      product={product}
                      onProductClick={handleProductClick}
                      isOwnProduct={false}
                      variant="grid"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Posts Section */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <Typography variant="h6" color="text.primary">
                  Posts ({filteredPosts.length})
                </Typography>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newMode) => newMode && setViewMode(newMode)}
                  size="small"
                >
                  <ToggleButton value="grid">
                    <GridView />
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ViewList />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Box
                sx={{
                  display: viewMode === "grid" ? "grid" : "flex",
                  gridTemplateColumns:
                    viewMode === "grid"
                      ? "repeat(auto-fill, minmax(280px, 1fr))"
                      : "none",
                  flexDirection: viewMode === "grid" ? "unset" : "column",
                  gap: 2,
                }}
              >
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post._id || `post-${post.id}`}
                    post={post}
                    onPostClick={handlePostClick}
                    onLike={handleLike}
                    isOwnPost={false}
                    variant={viewMode === "grid" ? "grid" : "feed"}
                    onEdit={null}
                    onDelete={null}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Dialogs */}
          {selectedPost && (
            <PostDialog
              post={selectedPost}
              open={!!selectedPost}
              onClose={handleClosePostDialog}
              onLike={() => handleLike(selectedPost.id)}
            />
          )}

          {selectedProduct && (
            <ProductDialog
              product={selectedProduct}
              open={!!selectedProduct}
              onClose={handleCloseProductDialog}
              isOwnProduct={false}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Homepage;
