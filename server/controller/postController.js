const express = require("express");
const { upload } = require("../utils/cloudinaryConfig");
const Post = require("../model/post");
const post = async (req, res) => {
  try {
    const mediaUrls = req.files.map((file) => file.path);
    const { user, caption } = req.body;

    const newPost = new Post({
      user,
      caption,
      mediaUrls: mediaUrls,
    });
    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
module.exports = {
  post: [upload.array("media", 5), post],
};
