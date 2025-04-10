const express = require("express");
const User = require("../model/user");
const Post = require("../model/post");
const Comment = require("../model/comments");

const create_comment_controller = async function (req, res) {
  try {
    const { postId, user, comment } = req.body;
    const newComment = new Comment({
      post: postId,
      user,
      comment,
    });
    await newComment.save();
    const post = await Post.findById(postId);
    post.Comments.push(newComment._id);
    await post.save();
    res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const get_comment_controller = async function (req, res) {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    const comments = await Comment.find({ post: post._id }); // searches the comments collection for documents where the post field matches the _id of a specific post.

    res.status(200).json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const delete_comment_controller = async function (req, res) {
  const { commentId } = req.params;
  const { postId } = req.body;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment Not found !!!" });
    }
    const post = await Post.findById(postId);
    post.Comments = post.Comments.filter((id) => id.toString() !== commentId);
    await post.save();
    await comment.deleteOne();
    res.status(200).json({ success: true, message: "comment is deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
module.exports = {
  create_comment_controller,
  get_comment_controller,
  delete_comment_controller,
};
