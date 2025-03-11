const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  caption: {
    type: String,
    required: true,
  },
  media: [{ type: String, required: true }],
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  Comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
const Post = mongoose.model("post", postSchema);
module.exports = Post;
