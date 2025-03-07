const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: "true" },

  caption: {
    type: String,
    required: true,
  },
  mediaUrls: [{ type: String, required: true }],
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  Comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
