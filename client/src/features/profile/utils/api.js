// Real API functions for profile functionality
const API_BASE = 'http://localhost:3000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  return {
    credentials: 'include',
    headers: {
      'Accept': 'application/json'
    }
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

// PATCH: Helper to always extract the correct userId
const getUserId = (user) => user?._id || user?.id || user || '';

// ==================== USER API FUNCTIONS ====================

// Get user profile
export const fetchUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/user/${getUserId(userId)}`, getAuthHeaders());
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: Failed to fetch user`);
    }
    if (!data) {
      throw new Error('No user data received');
    }
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Update user profile (name, bio, image)
export const updateProfile = async (userId, data) => {
  try {
    console.log('Updating profile for user:', userId);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('bio', data.bio);
    
    // Only append profilePicture if it's a File
    if (data.profilePicture instanceof File) {
      console.log('Including new profile picture');
      formData.append('profilePicture', data.profilePicture);
    }

    const response = await fetch(`${API_BASE}/user/updatePicture/${userId}`, {
      method: 'PUT',
      body: formData,
      credentials: 'include'
    });

    const result = await response.json();
    console.log('Profile update response:', result);

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update profile');
    }

    return result;
  } catch (err) {
    console.error('Error updating profile:', err);
    throw err;
  }
};


// Update user credentials (email, password)
export const updateUserCredentials = async (userId, credentials) => {
  try {
    const response = await fetch(`${API_BASE}/user/updateProfile/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword: credentials.currentPassword,
        password: credentials.newPassword
      }),
      credentials: 'include'
    });
    
    const data = await response.json();
    console.log('Password update response:', data);

    if (!response.ok) {
      if (data.message?.includes('incorrect password') || 
          data.message?.includes('Current password is incorrect')) {
        throw new Error('Current password is incorrect');
      }
      throw new Error(data.message || 'Failed to update password');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating credentials:', error);
    throw error;
  }
};

// Update user profile picture only
export const updateUserProfilePicture = async (userId, profilePicture) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);
    
    const response = await fetch(`${API_BASE}/user/${userId}`, {
      method: 'PUT',
      body: formData,
      ...getAuthHeaders()
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
};

// Follow user
export const followUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/user/follow/${userId}`, {
      method: 'POST',
      credentials: 'include',
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

// Unfollow user
export const unfollowUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/user/unfollow/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};


// Get user followers
export const fetchUserFollowers = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/user/${getUserId(userId)}/followers`, getAuthHeaders());
    const data = await handleResponse(response);
    return data.followers || [];
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
};

// Get user following
export const fetchUserFollowing = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/user/${getUserId(userId)}/followings`, getAuthHeaders());
    const data = await handleResponse(response);
    return data.followings || [];
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error;
  }
};

// Get user contacts (followers + following)
export const fetchUserContacts = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/user/${userId}/contacts`, getAuthHeaders());
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

// Get total user count
export const fetchUserCount = async () => {
  try {
    const response = await fetch(`${API_BASE}/user/length_user`, getAuthHeaders());
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching user count:', error);
    throw error;
  }
};

// ==================== POSTS API FUNCTIONS ====================

// Get user posts
export const fetchUserPosts = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/blog/postBlog/${getUserId(userId)}`, getAuthHeaders());
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: Failed to fetch posts`);
    }
    if (!data || !data.posts) {
      throw new Error('Invalid response format from server');
    }
    return Array.isArray(data.posts) ? data.posts : [];
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

// Get single post
export const fetchPost = async (postId) => {
  try {
    const response = await fetch(`${API_BASE}/blog/postBlog/get/${postId}`, getAuthHeaders());
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

// Create post
export const createPost = async (postData) => {
  try {
    console.log('Creating post with data:', {
      name: postData.name || postData.title || 'Untitled Post',
      caption: postData.caption || postData.content,
      userId: postData.userId,
      hasImage: !!postData.image
    });

    const formData = new FormData();
    formData.append('name', postData.name || postData.title || 'Untitled Post');
    formData.append('caption', postData.caption || postData.content);
    formData.append('userId', postData.userId);

    // Support single or multiple images
    if (postData.image) {
      if (Array.isArray(postData.image)) {
        postData.image.forEach(file => {
          formData.append('media', file);
        });
      } else {
        console.log(postData.image);
console.log(postData.image instanceof File); // يجب أن يعطي true

        formData.append('media', postData.image);
      }
    }

    const response = await fetch(`${API_BASE}/blog/postBlog`, {
    method: 'POST',
    body: formData,
    credentials: 'include', // مباشرة بدون استدعاء
    // ⚠️ لا تضيفي أي headers هنا إطلاقًا!
});
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Server returned non-JSON response:', text);
      throw new Error('Server returned invalid response format');
    }

    const data = await response.json();
    console.log('Server response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create post');
    }

    // Return the post data in the expected format
    return {
      _id: data.post._id,
      name: data.post.name,
      caption: data.post.caption,
      media: data.post.media || [],
      userId: data.post.user,
      user: data.post.user,
      likes: data.post.likes || [],
      comments: data.post.comments || [],
      createdAt: data.post.createdAt || new Date().toISOString(),
      isLiked: false
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Update post
export const updatePost = async (postId, postData) => {
  try {
    const response = await fetch(`${API_BASE}/blog/postBlog/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        name: postData.name,
        caption: postData.caption
      })
    });

    const data = await response.json();
    console.log('Update post response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update post');
    }

    return data.updatedPost || data.post || data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Delete post
export const deletePost = async (postId) => {
  try {
    const response = await fetch(`${API_BASE}/blog/postBlog/${postId}`, {
      method: 'DELETE',
      ...getAuthHeaders()
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Like post
export const likePost = async (postId, userId) => {
  const response = await fetch(`${API_BASE}/blog/postBlog/${postId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ userId }) 
  });

  const data = await handleResponse(response);
  console.log('Like result:', data.message); 
  return data;
};


// Unlike post
export const unlikePost = async (postId, userId) => {
    const response = await fetch(`${API_BASE}/blog/postBlog/${postId}/dislike`, {
      method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ userId }) 
  });

  return await handleResponse(response);
};


// Get post likes
export const getPostLikes = async (postId) => {
  try {
    const response = await fetch(`${API_BASE}/blog/postBlog/${postId}/likes`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include'
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching post likes:', error);
    throw error;
  }
};

// Search posts
export const searchPosts = async (query) => {
  try {
    const response = await fetch(`${API_BASE}/blog/searchPost?q=${query}`, getAuthHeaders());
    return await handleResponse(response);
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};

// ==================== PRODUCTS API FUNCTIONS ====================

// Get user products
export const fetchUserProducts = async (userId) => {
  console.log('Fetching products for user:', userId);
  try {
    const response = await fetch(`${API_BASE}/product/get/${getUserId(userId)}`, getAuthHeaders());
    const data = await handleResponse(response);
    return Array.isArray(data) ? data : (data.products || []);
  } catch (error) {
    console.error('Error fetching user products:', error);
    throw error;
  }
};

// Get single product
export const fetchProduct = async (productId) => {
  console.log('Fetching product with ID:', productId);
  try {
    const response = await fetch(`${API_BASE}/product/getOne/${productId}`, getAuthHeaders());
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Create product
export const createProduct = async (productData) => {
  try {
    // Validate required fields
    if (!productData.name) throw new Error('Product name is required');
    if (!productData.categoryId) throw new Error('Product category is required');
    if (!productData.mainImage) throw new Error('Product image is required');
    if (!productData.price) throw new Error('Product price is required');
    if (productData.stoke === undefined || productData.stoke === null) throw new Error('Product stock is required');

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('discreption', productData.description || '');
    formData.append('price', productData.price);
    formData.append('stoke', productData.stoke);
    formData.append('categoryId', productData.categoryId);
    formData.append('userId', getUserId(productData.userId || productData.user));

    // Handle mainImage (base64 or File)
    if (productData.mainImage.startsWith('data:')) {
      const response = await fetch(productData.mainImage);
      const blob = await response.blob();
      formData.append('mainImage', new File([blob], 'product-image.jpg', { type: 'image/jpeg' }));
    } else {
      formData.append('mainImage', productData.mainImage);
    }

    // Handle multipleFiles
    if (productData.multipleFiles) {
      const files = Array.isArray(productData.multipleFiles)
        ? productData.multipleFiles
        : [productData.multipleFiles];
      files.forEach(file => formData.append('multipleFiles', file));
    }

    const response = await fetch(`${API_BASE}/product/create`, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include'
    });

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      throw new Error(text.includes('Must supply api_key')
        ? 'Authentication failed. Please log in again.'
        : 'Server returned invalid response format');
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create product');

    return data.product || data;
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
    throw error;
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const formData = new FormData();
    if (productData.name) formData.append('name', productData.name);
    if (productData.description) formData.append('discreption', productData.description);
    if (productData.price) formData.append('price', productData.price);
    if (productData.stock !== undefined) formData.append('stoke', productData.stock);
    if (productData.categoryId) formData.append('categoryId', productData.categoryId);

    // ✅ Convert base64 image string to File if necessary
    if (productData.mainImage) {
      if (typeof productData.mainImage === 'string' && productData.mainImage.startsWith('data:')) {
        const response = await fetch(productData.mainImage);
        const blob = await response.blob();
        const file = new File([blob], 'product-image.jpg', { type: 'image/jpeg' });
        formData.append('mainImage', file);
      } else {
        formData.append('mainImage', productData.mainImage); // File object
      }
    }

    // ✅ Multiple files
    if (productData.multipleFiles) {
      const files = Array.isArray(productData.multipleFiles)
        ? productData.multipleFiles
        : [productData.multipleFiles];
      files.forEach(file => formData.append('multipleFiles', file));
    }

    const response = await fetch(`${API_BASE}/product/update/${productId}`, {
      method: 'PUT',
      body: formData,
      headers: { Accept: 'application/json' },
      credentials: 'include'
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};


// Delete product
export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_BASE}/product/delete/${productId}`, {
      method: 'DELETE',
      ...getAuthHeaders()
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Search products
export const searchProducts = async (query) => {
  try {
    const response = await fetch(`${API_BASE}/product/searchproduct?q=${query}`, getAuthHeaders());
    return await handleResponse(response);
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// ==================== ORDERS API FUNCTIONS ====================

// Get user orders
export const fetchUserOrders = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/order/user/${userId}`, {
      credentials: 'include'
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Get artisan orders (orders from this artisan)
export const fetchArtisanOrders = async (artisanId) => {
  try {
    const response = await fetch(`${API_BASE}/order/artissan/${artisanId}`, {
      credentials: 'include', 
    });
    const data = await handleResponse(response);
    console.log("🔍 Artisan Orders:", data);
    return data.commandedOrders || [];
  } catch (error) {
    console.error('Error fetching artisan orders:', error);
    throw error;
  }
};

// Create order
// Create order
export const createOrder = async (artisanId, orderData) => {
  try {
    const response = await fetch(`${API_BASE}/order/create/${artisanId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(orderData)
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};



// Update order status
export const updateOrderStatus = async (orderId, status, paymentStatus = null) => {
  try {
    const body = { status };
    if (paymentStatus) body.paymentStatus = paymentStatus;

    const response = await fetch(`${API_BASE}/order/update/${orderId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};


// Delete order
export const deleteOrderById = async (orderId) => {
  try {
    const res = await fetch(`${API_BASE}/order/delete/${orderId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    return await handleResponse(res);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};


// Get single order
export const fetchOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE}/order/get/${orderId}`, getAuthHeaders());
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// ==================== COMMENTS API FUNCTIONS ====================

// Get post comments
export const fetchPostComments = async (postId) => {
  try {
    const response = await fetch(`${API_BASE}/comment/post/${postId}`, getAuthHeaders());
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Create comment
export const addComment = async (postId, { comment, user }) => {
  const response = await fetch(`${API_BASE}/comment/create/${postId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ comment, user })
  });

  return await handleResponse(response);
};


// Delete comment
export const deleteComment = async (commentId, postId) => {
  try {
    const response = await fetch(`${API_BASE}/comment/delete/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postId }),
      credentials: 'include',
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};


// ==================== HELPER FUNCTIONS ====================

// Check if current user is following another user
export const checkFollowStatus = (currentUser, targetUserId) => {
  if (!currentUser || !currentUser.followings) return false;
  return currentUser.followings.includes(targetUserId);
};

// Check if current user is being followed by another user
export const checkIsFollowedBy = (currentUser, targetUserId) => {
  if (!currentUser || !currentUser.followers) return false;
  return currentUser.followers.includes(targetUserId);
};

// Get all users (for compatibility)
export const fetchAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE}/user/length_user`, getAuthHeaders());
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

// Legacy functions for compatibility
export const savePost = (postId) => {
  return Promise.resolve({ success: true });
};

export const unsavePost = (postId) => {
  return Promise.resolve({ success: true });
};

// Fetch all products (fallback: fetch all by using a special userId or admin endpoint if needed)
export const fetchAllProducts = async () => {
  try {
    // Use the admin endpoint to fetch all products (if user is admin)
    const response = await fetch('http://localhost:3000/api/admin/get', getAuthHeaders());
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
    // The admin endpoint may return products directly or in a property
    return Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error fetching all products: No endpoint for all products. Backend must provide an endpoint to fetch all products.');
    return [];
  }
};

// Fetch recommended posts for a user
export const fetchRecommendedPosts = async (userId) => {
  const response = await fetch(`${API_BASE}/blog/postBlog/recommend/${userId}`, getAuthHeaders());
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch recommended posts');
  return Array.isArray(data.recommendedPosts) ? data.recommendedPosts : [];
};

// Fetch products by category (admin endpoint)
export const fetchProductsByCategory = async (categoryName) => {
  try {
    const response = await fetch(`http://localhost:3000/api/admin/get/${encodeURIComponent(categoryName)}`, getAuthHeaders());
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch products by category');
    return Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

export const fetchAllPosts = async () => {
  try {
    // Use the search endpoint with an empty query to fetch all posts
    const response = await fetch(`${API_BASE}/blog/searchPost?q=`, getAuthHeaders());
    const data = await response.json();
    console.log('fetchAllPosts response:', data); // Debug log
    if (!response.ok) throw new Error(data.message || 'Failed to fetch posts');
    return Array.isArray(data.posts) ? data.posts : (Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
};

//get category by admin page
export const fetchCategories = async () => {
  const res = await fetch(`http://localhost:3000/api/admin/get`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

  // normalise for UI
  return data.map((c) => ({
    id: c._id ?? c.id,
    name: c.name,
    count: c.productCount ?? c.count ?? 0,
    status: c.status ?? "active",
  }));
};
//Add category by admin
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const addCategory = async (name) => {
  if (!name.trim()) throw new Error("Category name is empty");

  // Automatically get adminId from localStorage
  const adminId = localStorage.getItem("userId") || "6811034eefbf78a8cc4b236b";

  const res = await fetch(
    `http://localhost:3000/api/admin/addCategory/${adminId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // sends cookie with JWT
      body: JSON.stringify({ name: name.trim() }),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Failed to add category");

  return {
    id: data._id,
    name: data.name,
    count: 0,
    status: "active",
  };
};
//get category home page
export const fetchCategoriesHomePage = async () => {
  const res = await fetch("http://localhost:3000/api/admin/get", {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch categories");

  return data;
};
