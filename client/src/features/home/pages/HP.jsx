// Updated Home Page with Full Post/Product Dialog Handlers
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Chip, ToggleButton, ToggleButtonGroup, Typography, CircularProgress
} from "@mui/material";
import { GridView, ViewList } from "@mui/icons-material";
import SideDrawer from "../../../shared/components/layout/SideDrawer";
import AppHeader from "../../../shared/components/layout/AppHeader";
import PostCard from "../../../shared/components/posts/PostCard";
import ProductCard from "../../../shared/components/products/ProductCard";
import PostDialog from "../../../shared/components/posts/PostDialog";
import ProductDialog from "../../../shared/components/products/ProductDialog";
import SearchBar from "../../../shared/components/common/SearchBar";
import "../../../app.css";
import {
  fetchRecommendedPosts,
  searchPosts,
  searchProducts,
  fetchProductsByCategory,
  fetchAllPosts,
  likePost,
  unlikePost,
  deletePost,
  addComment,
  deleteComment,
  fetchCategoriesHomePage,
  createOrder
} from "../../../features/profile/utils/api";
import { useAuth } from "../../../shared/contexts/UserContext";
import Masonry from 'react-masonry-css';

const Homepage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategoriesHomePage();
        setCategories(data.map(cat => cat.name));
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (currentUser?._id) {
          const data = await fetchRecommendedPosts(currentUser._id);
          if (Array.isArray(data) && data.length > 0) {
            setPosts(data);
          } else {
            const allPosts = await fetchAllPosts();
            setPosts(allPosts || []);
          }
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
    if (currentUser) fetchData();
  }, [currentUser]);

  useEffect(() => {
    const fetchSearchAndCategory = async () => {
      try {
        if (searchTerm && searchTerm.trim()) {
          const [foundPosts, foundProducts] = await Promise.all([
            searchPosts(searchTerm),
            searchProducts(searchTerm)
          ]);
          setPosts(foundPosts?.posts || []);
          setProducts(foundProducts?.products || []);
          setShowProducts(true);
        } else if (selectedCategory) {
          const filteredProducts = await fetchProductsByCategory(selectedCategory);
          setPosts([]);
          setProducts(filteredProducts || []);
          setShowProducts(true);
        } else {
          if (currentUser?._id) {
            const data = await fetchRecommendedPosts(currentUser._id);
            setPosts(data || []);
          } else {
            const allPosts = await fetchAllPosts();
            setPosts(allPosts || []);
          }
          setProducts([]);
          setShowProducts(false);
        }
      } catch (err) {
        console.error("Error loading filtered content:", err);
      }
    };
    fetchSearchAndCategory();
  }, [searchTerm, selectedCategory, currentUser]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setShowProducts(value.length > 0);
  };

  const handleCategorySelect = (category) => {
    setSearchTerm("");
    setSelectedCategory(category);
    setShowProducts(true);
  };

  const handleLike = async (postId) => {
    try {
      const post = posts.find(p => p._id === postId);
      const liked = post.likes.includes(currentUser._id);

      const data = liked
        ? await unlikePost(postId, currentUser._id)
        : await likePost(postId, currentUser._id);

      const updated = { ...post, likes: data.post.likes, isLiked: !liked };
      setPosts(prev => prev.map(p => p._id === postId ? updated : p));
      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost(updated);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    try {
      const newComment = await addComment(postId, {
        comment: commentText,
        user: currentUser._id
      });
      setPosts(prev => prev.map(post =>
        post._id === postId
          ? { ...post, Comments: [...(post.Comments || []), newComment] }
          : post
      ));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await deleteComment(commentId, postId);
      setPosts(prev => prev.map(post =>
        post._id === postId
          ? { ...post, Comments: (post.Comments || []).filter(c => c._id !== commentId) }
          : post
      ));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(prev => prev.filter(p => p._id !== postId));
      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost(null);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleCreateOrder = async (artisanId, productId) => {
    if (!currentUser?._id) {
      alert("Missing user information");
      return;
    }

    try {
      const orderData = {
        userId: currentUser._id,
        items: [{ product: productId, quantity: 1 }],
        shippingAddress: "Temporary Address Placeholder",
        phoneNumber: "0123456789"
      };
      const response = await createOrder(artisanId, orderData);
      alert("✅ Order created successfully!");
    } catch (err) {
      console.error("Order failed:", err);
      alert("Failed to create order: " + (err.message || "Unknown error"));
    }
  };

  // --- Product Handlers ---
  const handleEditProduct = (product) => {
    alert(`Edit product: ${product.name}`);
    // TODO: Open product edit dialog/modal
  };

  const handleDeleteProduct = async (productId) => {
    alert(`Delete product: ${productId}`);
    // TODO: Implement product deletion logic
  };

  // --- Post Handlers ---
  const handleEditPost = (post) => {
    alert(`Edit post: ${post.name}`);
    // TODO: Open post edit dialog/modal
  };

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
    const category = typeof product.category === "string" ? product.category : product.category?.name || "";
    const matchSearch = searchTerm
      ? product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchCat = selectedCategory
      ? category.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    return matchSearch && matchCat;
  });

  return (
    <>
      <AppHeader />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <SideDrawer onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />

        <Box sx={{ flexGrow: 1, pl: { xs: 0, sm: '40px' },pb: { xs: 0, sm: '40px' },pr: { xs: 0, sm: '40px' }, pt: '64px' }}>
          <Box sx={{ p: 2 }}>
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search posts and products..."
            />
          </Box>

          <Box sx={{ px: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip label="All" onClick={() => { setSelectedCategory(""); setShowProducts(false); }} color={selectedCategory === "" ? "primary" : "default"} />
            {categories.map((cat, i) => (
              <Chip key={i} label={cat} onClick={() => handleCategorySelect(cat)} color={selectedCategory === cat ? "primary" : "default"} />
            ))}
          </Box>

          {loading ? (
            <Box sx={{ p: 5, textAlign: "center" }}><CircularProgress /></Box>
          ) : (
            <Box sx={{ P: 2 }}>
              {showProducts && (
                <Box mb={3}>
                  <Typography variant="h6">Products ({filteredProducts.length})</Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 2 }}>
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        variant="grid"
                        onProductClick={() => setSelectedProduct(product)}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                        isOwnProduct={product.user && currentUser ? product.user._id === currentUser._id : false}
                        onOrder={() => handleCreateOrder(product.user?._id, product._id)}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Posts Section */}
              <Box sx={{ px: 2, mt: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6">Posts ({filteredPosts.length})</Typography>
                  <ToggleButtonGroup value={viewMode} exclusive onChange={(e, v) => v && setViewMode(v)}>
                    <ToggleButton value="grid"><GridView /></ToggleButton>
                    <ToggleButton value="list"><ViewList /></ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                {viewMode === 'grid' ? (
                  <Masonry
                    breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                  >
                    {filteredPosts.map(post => (
                      <PostCard
                        key={post._id}
                        post={post}
                        onPostClick={() => setSelectedPost(post)}
                        onLike={handleLike}
                        onEdit={handleEditPost}
                        onDelete={handleDeletePost}
                        isOwnPost={post.user && currentUser ? post.user._id === currentUser._id : false}
                        variant="grid"
                      />
                    ))}
                  </Masonry>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredPosts.map(post => (
                      <PostCard
                        key={post._id}
                        post={post}
                        onPostClick={() => setSelectedPost(post)}
                        onLike={handleLike}
                        onEdit={handleEditPost}
                        onDelete={handleDeletePost}
                        isOwnPost={post.user && currentUser ? post.user._id === currentUser._id : false}
                        variant="feed"
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {selectedPost && (
            <PostDialog
              post={selectedPost}
              open={!!selectedPost}
              onClose={() => setSelectedPost(null)}
              onLike={() => handleLike(selectedPost._id)}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onDelete={handleDeletePost}
              currentUser={currentUser}
              isOwnPost={selectedPost.user._id === currentUser?._id}
            />
          )}

          {selectedProduct && (
            <ProductDialog
              product={selectedProduct}
              open={!!selectedProduct}
              onClose={() => setSelectedProduct(null)}
              currentUser={currentUser}
              isOwnProduct={selectedProduct.user._id === currentUser?._id}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Homepage;
