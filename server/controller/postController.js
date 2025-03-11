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
      media: mediaUrls,
    });
    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const GET_post = async (req, res) => {
  Post.find()
    .then((resault) => res.status(201).json({ resault }))
    .catch((err) => res.status().json({ message: err.message }));
};
const GET_One_post = async (req, res) => {
  const id = req.params.id;
  Post.findById(id)
    .then((resault) => {
      if (!resault) {
        res.status(404).json({ message: "post not found !" });
      }
      res.status(201).json({ resault });
    })
    .catch((err) => res.status(401).json({ message: err.message }));
};
const Update_post = async (req, res) => {
  const id = req.params.id;
  Post.findByIdAndUpdate()
    .then((res) => res.status(201).json({ res }))
    .catch((err) => res.status(400).json({ message: err.message }));
};
const Deleat_post = async (req, res) => {
  const id = req.params.is;
  console.log(id);
  Post.findByIdAndDelete(id)
    .then((res) => res.status(201).json({ res }))
    .catch((err) => res.status(401).json({ message: err.message }));
};
module.exports = {
  post,
  GET_post,
  GET_One_post,
  Update_post,
  Deleat_post,
};
