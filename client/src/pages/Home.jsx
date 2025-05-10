import React, { useState, useEffect } from "react";


const Home = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostPopup, setShowPostPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const [newPostCaption, setNewPostCaption] = useState("");
  const [newPostMedia, setNewPostMedia] = useState(null);
  const [error, setError] = useState("");
  const [showActionPopup, setShowActionPopup] = useState(false);

  useEffect(() => {
    // Fetch all posts using fetch
    fetch("http://localhost:3000/api/blog/postBlog")
      .then((response) => response.json())
      .then((data) => setPosts(data.resault))
      .catch((err) => setError("Failed to fetch posts"));
  }, []);

  const handlePostClick = (id) => {
    // Fetch a single post by ID using fetch
    fetch(`http://localhost:3000/api/blog/postBlog/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedPost(data.resault);
        setShowPostPopup(true);
      })
      .catch((err) => setError("Failed to fetch post"));
  };

  const handleUpdate = (id) => {
    // Update the post using fetch
    fetch(`http://localhost:3000/api/blog/postBlog/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ caption: newCaption }),
    })
      .then((response) => response.json())
      .then((data) => {
        setShowUpdatePopup(false);
        // Update the posts state
        setPosts(posts.map((post) => (post._id === id ? data.resault : post)));
      })
      .catch((err) => setError("Failed to update post"));
  };

  const handleDelete = (id) => {
    // Delete the post using fetch
    fetch(`http://localhost:3000/api/blog/postBlog/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setPosts(posts.filter((post) => post._id !== id));
      })
      .catch((err) => setError("Failed to delete post"));
  };

  // Add a new post
  const handleAddPost = () => {
    const formData = new FormData();
    formData.append("caption", newPostCaption);
    if (newPostMedia) {
      formData.append("media", newPostMedia);
    }

    fetch("http://localhost:3000/api/blog/postBlog", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts([data.resault, ...posts]); // Add new post to the beginning of the list
        setNewPostCaption("");
        setNewPostMedia(null);
        setShowPostPopup(false);
      })
      .catch((err) => setError("Failed to add post"));
  };

  const handleActionPopup = (postId) => {
    setSelectedPost(postId);
    setShowActionPopup(true);
  };

  return (
    <div className="home">
      {/* Navigation Bar */}
      <div className="navbar">
        <button onClick={() => setShowPostPopup(true)}>Add Post</button>
        <button>Profile</button>
      </div>

      {/* Posts Section */}
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post._id} className="post">
            <div className="media">
              {post.media && <img src={post.media[0]} alt="Post Media" />}
            </div>
            <div className="caption">
              <p>{post.caption}</p>
            </div>
            <div className="options">
              <button onClick={() => handleActionPopup(post._id)}>...</button>
            </div>
          </div>
        ))}
      </div>

      {/* Post Popup */}
      {showPostPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Post Details</h3>
            {selectedPost && (
              <>
                <div className="media">
                  {selectedPost.media && <img src={selectedPost.media[0]} alt="Post Media" />}
                </div>
                <p>{selectedPost.caption}</p>
                <div className="post-options">
                  <button onClick={() => setShowUpdatePopup(true)}>Update</button>
                  <button onClick={() => handleDelete(selectedPost._id)}>Delete</button>
                </div>
              </>
            )}
            <button onClick={() => setShowPostPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Update Post Popup */}
      {showUpdatePopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Update Post</h3>
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="Enter new caption"
            />
            <button onClick={() => handleUpdate(selectedPost._id)}>Update</button>
            <button onClick={() => setShowUpdatePopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Add Post Popup */}
      {showPostPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Add New Post</h3>
            <input
              type="text"
              value={newPostCaption}
              onChange={(e) => setNewPostCaption(e.target.value)}
              placeholder="Enter caption"
            />
            <input
              type="file"
              onChange={(e) => setNewPostMedia(e.target.files[0])}
            />
            <button onClick={handleAddPost}>Add Post</button>
            <button onClick={() => setShowPostPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Action Popup (Delete or Update options) */}
      {showActionPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Choose Action</h3>
            <button onClick={() => setShowUpdatePopup(true)}>Update</button>
            <button onClick={() => handleDelete(selectedPost)}>Delete</button>
            <button onClick={() => setShowActionPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Home;
