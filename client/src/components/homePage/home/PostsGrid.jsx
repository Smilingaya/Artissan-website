import React from 'react';
import { Grid } from '@mui/material';
import PostCard from './PostCard';

const PostsGrid = ({ posts, setSelectedPost }) => {
  return (
    <Grid container spacing={3}>
      {posts.map((post) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={post._id}>
          <PostCard post={post} onClick={setSelectedPost} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PostsGrid;