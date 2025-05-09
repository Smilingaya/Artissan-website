
import React, { useEffect, useState } from "react";
import "./Posts.css";

function Posts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/posts/${userId}`);
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <img src={post.image} alt={post.title} />
          <h2>{post.title}</h2>
        </div>
      ))}
    </div>
  );
}

export default Posts;



