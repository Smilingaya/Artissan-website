const express = require("express");
const Category = require("../model/category");
const Product = require("../model/product");
const User = require("../model/user");
const Post = require("../model/post");
const Order = require("../model/order");
const blacklistedUser = require("../model/blackList");
const Comment = require("../model/comments");

const add_category = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role != "admin") {
      return res
        .status(403)
        .json({ message: "you are not allowed to do this action" });
    }
    const newCategory = new Category({
      name,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const get_category = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const get_product_by_category = async (req, res) => {
  const categoryName = req.params.categoryName;
  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const productsByCategory = await Product.find({
      category: category._id,
    }).populate('user').populate('category', 'name');

    res.status(200).json(productsByCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Comprehensive block user function
const blockUser = async (req, res) => {
  const { userId } = req.params;
  const { reason = "Violated terms" } = req.body;
  
  try {
    // Find the user to be blocked
    const userToBlock = await User.findById(userId);
    if (!userToBlock) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already blacklisted
    const alreadyBlacklisted = await blacklistedUser.findOne({ email: userToBlock.email });
    if (alreadyBlacklisted) {
      return res.status(409).json({ message: "User is already blacklisted" });
    }

    // Add user to blacklist
    await blacklistedUser.create({
      email: userToBlock.email,
      name: userToBlock.name,
      reason: reason
    });

    // Remove all user's posts
    const deletedPosts = await Post.deleteMany({ user: userId });
    console.log(`Deleted ${deletedPosts.deletedCount} posts`);

    // Remove all user's products
    const deletedProducts = await Product.deleteMany({ user: userId });
    console.log(`Deleted ${deletedProducts.deletedCount} products`);

    // Remove all user's comments
    const deletedComments = await Comment.deleteMany({ user: userId });
    console.log(`Deleted ${deletedComments.deletedCount} comments`);

    // Remove user from other users' followers/following lists
    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );
    await User.updateMany(
      { followings: userId },
      { $pull: { followings: userId } }
    );

    // Remove user's likes from posts
    await Post.updateMany(
      { likes: userId },
      { $pull: { likes: userId } }
    );

    // Remove user's orders
    const deletedOrders = await Order.deleteMany({ 
      $or: [
        { userId: userId },
        { artisanId: userId }
      ]
    });
    console.log(`Deleted ${deletedOrders.deletedCount} orders`);

    // Finally, delete the user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User blocked successfully",
      deletedContent: {
        posts: deletedPosts.deletedCount,
        products: deletedProducts.deletedCount,
        comments: deletedComments.deletedCount,
        orders: deletedOrders.deletedCount
      }
    });

  } catch (err) {
    console.error("Error blocking user:", err);
    res.status(500).json({ message: "Failed to block user", error: err.message });
  }
};

const listBlacklistedUsers = async (req, res) => {
  const { id } = req.params;
  try {
    console.log(id);
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await blacklistedUser.create({ email: user.email });
    await user.deleteOne();
    res.status(200).json({ message: "User blacklisted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addBlacklistedUser = async (req, res) => {
  const { email, reason, name } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "user Not found" });
  }

  try {
    const exists = await blacklistedUser.findOne({ user });
    if (exists) {
      return res.status(409).json({ message: "User already blacklisted" });
    }

    await blacklistedUser.create({ email, name, reason });

    // Optional: remove user from main users if exists
    await User.deleteOne();

    res.status(201).json({ message: "User blacklisted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const blackList = async (req, res) => {
  try {
    const blacklistedUsers = await blacklistedUser.find();
    res.status(200).json(blacklistedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const countByCategory = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$category", // group key
          total: { $sum: 1 }, // add 1 per document
        },
      },
      { $sort: { total: -1 } }, // optional: biggest → smallest
    ]);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteBlacklistedUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await blacklistedUser.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Blacklisted user not found" });
    }
    await user.deleteOne();
    res.status(200).json({ message: "Blacklisted user deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPlatformStats = async (req, res) => {
  try {
    const [users, posts, products, orders] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);

    res.status(200).json({ users, posts, products, orders });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load stats", error: err.message });
  }
};

module.exports = {
  add_category,
  get_category,
  get_product_by_category,
  listBlacklistedUsers,
  countByCategory,
  addBlacklistedUser,
  blackList,
  deleteBlacklistedUser,
  getPlatformStats,
  blockUser,
};
