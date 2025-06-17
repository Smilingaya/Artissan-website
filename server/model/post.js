const mongoose = require("mongoose");
const User = require('./user');
const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  media: [{ type: String, required: true }],
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  Comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
