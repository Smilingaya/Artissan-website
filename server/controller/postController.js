const express = require("express");
const { upload } = require("../utils/cloudinaryConfig");
const cloudinary = require("cloudinary").v2;
const User = require("../model/user");
const Post = require("../model/post");
const craete_post = async (req, res) => {
  try {
    const mediaUrls = req.files.map((file) => file.path);
    const { userId, caption } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      caption,
      media: mediaUrls,
    });
    await newPost.save();
    user.posts.push(newPost._id);
    await user.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const GET_post = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userPosts = await Post.find({ user: userId });

    res.status(200).json({ success: true, posts: userPosts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const GET_One_post = async (req, res) => {
  const id = req.params.postId;
  Post.findById(id)
    .then((resault) => {
      if (!resault) {
        return res.status(404).json({ message: "post not found !" });
      }
      res.status(200).json({ resault });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
const Update_post = async (req, res) => {
  try {
    const id = req.params.postId;
    const { caption } = req.body;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { caption },
      {
        new: true,
      }
    );

    res.status(200).json({ updatedPost });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
//errore
const Deleat_post = async (req, res) => {
  const id = req.params.postId;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    await cloudinary.uploader.destroy(post.publicId, function (error, result) {
      console.log(result, error);
    });
    await Post.findByIdAndDelete(id);
    res.status(200).json({ msg: "delet succes" });
  } catch (err) {
    console.log(err);
  }
};
const like_Post_Controller = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.body.userId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post Not Found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "user Not Found" });
    }
    post.likes.push(userId);
    await post.save();
    res.status(200).json({ message: "post like successfully ", post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const dislike_Controller = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post Not Found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "user Not Found" });
    }

    const updatePost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: userId }, //remove userId from likes
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "post dislike successfully ", post: updatePost });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const likes_get_controller = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const likesArray = Array.isArray(post.likes) ? post.likes : [];

    res.status(200).json({
      likesCount: likesArray.length,
      likedBy: likesArray,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
module.exports = {
  craete_post,
  GET_post,
  GET_One_post,
  Update_post,
  Deleat_post,
  like_Post_Controller,
  dislike_Controller,
  likes_get_controller,
};
