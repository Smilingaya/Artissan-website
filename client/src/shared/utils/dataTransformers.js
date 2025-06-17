// Standardize post data structure across the application
export const standardizePostData = (post) => {
  if (!post) return null;
  
  return {
    id: post._id || post.id,
    title: post.title || '',
    content: post.content || post.description || '',
    imageUrl: post.imageUrl || post.image || '',
    createdAt: post.createdAt || post.timestamp || new Date().toISOString(),
    user: {
      id: post.user?._id || post.user?.id || '',
      name: post.user?.name || '',
      avatar: post.user?.avatar || '',
    },
    likes: post.likes || 0,
    isLiked: post.isLiked || false,
    comments: post.comments || [],
  };
};

// Transform array of posts
export const standardizePostsArray = (posts) => {
  return posts.map(post => ({
    ...post,
    id: post.id || post._id,
    user: {
      id: post.user?.id || post.userId,
      name: post.user?.name || post.userName,
      avatar: post.user?.avatar || post.userAvatar
    },
    likes: post.likes || 0,
    comments: post.comments || 0,
    timestamp: post.timestamp || 'Just now',
    isLiked: post.isLiked || false
  }));
}; 