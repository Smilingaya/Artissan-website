const express = require("express");
const { upload } = require("../utils/cloudinaryConfig");
const cloudinary = require("cloudinary").v2;
const User = require("../model/user");
const Post = require("../model/post");
const { extractPublicId } = require("../helper/helper");
const mongoose = require('mongoose'); // make sure it's imported


const craete_post = async (req, res) => {
  try {
    const mediaUrls = req.files.map(file => file.path);
    const { userId, caption, name } = req.body;

    let productLinks = [];
    try {
      productLinks = JSON.parse(req.body.productLinks || '[]');
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid productLinks format' });
    }

    if (!Array.isArray(productLinks)) {
      return res.status(400).json({ success: false, message: 'productLinks must be an array' });
    }

    productLinks = productLinks
      .filter(id => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/))
      .map(id => new mongoose.Types.ObjectId(id));

    // Create the post
    const newPost = new Post({
      user: userId,
      caption,
      media: mediaUrls,
      name,
      productLinks,
    });

    await newPost.save();

    // Link the post to the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

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

    const userPosts = await Post.find({ user: userId }).populate('user', 'name avatar profilePicture').populate('Comments').populate('productLinks');
    console.log('Fetched post with products:', userPosts.map(p => p.productLinks));
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
    const { caption, name } = req.body;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { caption, name },
      {
        new: true,
      }
    );

    res.status(200).json({ updatedPost });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const Deleat_post = async (req, res) => {
  const id = req.params.postId;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    const publicIds = [];
    if (post.media && post.media.length > 0) {
      post.media.forEach((fileUrl) => {
        const publicId = extractPublicId(fileUrl);
        if (publicId) publicIds.push(publicId);
      });
    }
    await Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id)));
    await Post.findByIdAndDelete(id);
    res.status(200).json({ msg: "delet succes" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
    await user.likedPosts.push(postId);
    await user.save();
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
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { likedPosts: postId }, //remove postId from likedPosts
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
const search_post = async (req, res) => {
  let { query } = req.query;
  try {
    if (typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ success: false, message: 'Query must be a non-empty string' });
    }
    const regex = new RegExp(query, "i");
    const posts = await Post.find({
      $or: [
        { caption: { $regex: regex } },
        { name: { $regex: regex } },
      ],
    });
    if (!posts) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    res.status(200).json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const recommendPosts = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId)
      .populate("likedPosts")
      .populate("followings");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const likedNames = user.likedPosts.map((post) => post.name);
    const likedCaptions = user.likedPosts.map((post) => post.caption);
    const likedPostIds = user.likedPosts.map((post) => post._id);
    const followingUserIds = user.followings.map((f) => f._id);

    const captionRegex = likedCaptions.length
      ? new RegExp(likedCaptions.join("|"), "i")
      : null;

    const queryConditions = [
      { user: { $ne: userId } },
      { _id: { $nin: likedPostIds } },
    ];

    const orConditions = [];

    if (likedNames.length) {
      orConditions.push({ category: { $in: likedNames } });
    }

    if (captionRegex) {
      orConditions.push({ caption: { $regex: captionRegex } });
    }

    if (followingUserIds.length) {
      orConditions.push({ user: { $in: followingUserIds } });
    }

    if (orConditions.length > 0) {
      queryConditions.push({ $or: orConditions });
    }

    const recommendedPosts = await Post.find({ $and: queryConditions }).sort({
      createdAt: -1,
    }).populate('user', 'name avatar profilePicture').populate('Comments');

    res.status(200).json({ success: true, recommendedPosts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const length_post = async (req, res) => {
  try {
    const count = await Post.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const fetchAllPlatformPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar profilePicture')
      .populate('Comments');
    res.status(200).json({ success: true, posts });
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
  search_post,
  recommendPosts,
  length_post,
  fetchAllPlatformPosts,
};
