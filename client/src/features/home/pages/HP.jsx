// src/features/home/pages/HP.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  CircularProgress
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
  fetchAllPosts,
  likePost,
  unlikePost,
  addComment,
  deleteComment
} from "../../../features/profile/utils/api";
import { standardizePostsArray } from "../../../shared/utils/dataTransformers";
import { useAuth } from "../../../shared/contexts/UserContext";

const Homepage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userId = currentUser?._id;
        if (userId) {
          const data = await fetchRecommendedPosts(userId);
          setPosts(data.recommendedPosts || []);
        } else {
          const allPosts = await fetchAllPosts();
          setPosts(allPosts || []);
        }
        setProducts([]);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm) {
        const foundPosts = await searchPosts(searchTerm);
        const foundProducts = await searchProducts(searchTerm);
        setPosts(foundPosts || []);
        setProducts(foundProducts || []);
      } else if (selectedCategory) {
        const filteredProducts = await fetchProductsByCategory(selectedCategory);
        setProducts(filteredProducts || []);
      } else {
        if (currentUser?._id) {
        const data = await fetchRecommendedPosts(currentUser._id);
        setPosts(data.recommendedPosts || []);
}
        setProducts([]);
      }
    };
    fetchSearchResults();
  }, [searchTerm, selectedCategory]);

  const handleLike = async (postId) => {
    try {
      const updatedPost = posts.find(p => p._id === postId);
      const isLiked = updatedPost.likes.includes(currentUser._id);

      const data = isLiked
        ? await unlikePost(postId, currentUser._id)
        : await likePost(postId, currentUser._id);

      const newPost = {
        ...updatedPost,
        likes: data.post.likes,
        isLiked: !isLiked
      };

      setPosts(prev => prev.map(p => p._id === postId ? newPost : p));
      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost(newPost);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setShowProducts(value.length > 0);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowProducts(category.length > 0);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const categories = [
    ...new Set([
      ...posts.map(p => p.category).filter(Boolean),
      ...products.map(p => p.category).filter(Boolean)
    ])
  ];

  const filteredPosts = posts.filter(post => {
    const matchSearch = searchTerm
      ? post.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.name?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchCat = selectedCategory
      ? post.category?.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    return matchSearch && matchCat;
  });

  const filteredProducts = products.filter(product => {
    const matchSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchCat = selectedCategory
      ? product.category.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    return matchSearch && matchCat;
  });

  return (
    <>
      <AppHeader />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <SideDrawer onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />

        <Box sx={{ flexGrow: 1, pl: { xs: 0, sm: '96px' }, pt: '64px' }}>
          <Box sx={{ p: 2 }}>
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search posts and products..."
            />
          </Box>

          <Box sx={{ px: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label="All"
              onClick={() => { setSelectedCategory(""); setShowProducts(false); }}
              color={selectedCategory === "" ? "primary" : "default"}
            />
            {categories.map((cat, i) => (
              <Chip
                key={i}
                label={cat}
                onClick={() => handleCategorySelect(cat)}
                color={selectedCategory === cat ? "primary" : "default"}
              />
            ))}
          </Box>

          {loading ? (
            <Box sx={{ p: 5, textAlign: "center" }}><CircularProgress /></Box>
          ) : (
            <Box sx={{ p: 2 }}>
              {showProducts && (
                <Box mb={3}>
                  <Typography variant="h6">Products ({filteredProducts.length})</Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 2 }}>
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        variant="grid"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6">Posts ({filteredPosts.length})</Typography>
                  <ToggleButtonGroup value={viewMode} exclusive onChange={(e, v) => v && setViewMode(v)}>
                    <ToggleButton value="grid"><GridView /></ToggleButton>
                    <ToggleButton value="list"><ViewList /></ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                <Box sx={{ display: viewMode === "grid" ? "grid" : "flex", gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(280px, 1fr))" : "none", flexDirection: viewMode === "grid" ? "unset" : "column", gap: 2 }}>
                  {filteredPosts.map(post => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onPostClick={() => setSelectedPost(post)}
                      onLike={handleLike}
                      variant={viewMode === "grid" ? "grid" : "feed"}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {selectedPost && (
            <PostDialog
              post={selectedPost}
              open={!!selectedPost}
              onClose={() => setSelectedPost(null)}
              onLike={() => handleLike(selectedPost._id)}
            />
          )}

          {selectedProduct && (
            <ProductDialog
              product={selectedProduct}
              open={!!selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Homepage;
