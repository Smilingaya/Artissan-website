import React from 'react';
import { Box, Tabs, Tab, Typography, IconButton } from '@mui/material';
import { GridView, ListAlt } from '@mui/icons-material';

const ProfileTabs = ({ user, onSelectPost, onSelectProduct, onAddPost, onUpdatePost }) => {
  return (
    <Box>
      <Tabs value={0} sx={{ mb: 3 }}>
        <Tab label="Posts" />
        <Tab label="Products" />
      </Tabs>

      {/* Posts Section */}
      <Box>
        {user.posts.map((post) => (
          <Box key={post._id} onClick={() => onSelectPost(post)} sx={{ cursor: 'pointer', mb: 2 }}>
            <img src={post.image} alt={post.title} style={{ width: '100%', height: 'auto' }} />
            <Typography variant="h6">{post.title}</Typography>
            <Typography variant="body2">{post.description}</Typography>
          </Box>
        ))}
        <Box onClick={onAddPost} sx={{ cursor: 'pointer', color: 'primary.main', mt: 2 }}>Add Post</Box>
      </Box>

      {/* Products Section */}
      <Box>
        {user.products.map((product) => (
          <Box key={product._id} onClick={() => onSelectProduct(product)} sx={{ cursor: 'pointer', mb: 2 }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: 'auto' }} />
            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="body2">${product.price}</Typography>
          </Box>
        ))}
        <Box onClick={onAddPost} sx={{ cursor: 'pointer', color: 'primary.main', mt: 2 }}>Add Product</Box>
      </Box>

      {/* View Switch (List/Grid) */}
      <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
        <IconButton>
          <ListAlt />
        </IconButton>
        <IconButton>
          <GridView />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ProfileTabs;
