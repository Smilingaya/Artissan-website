const express = require("express");
const Category = require("../model/category");
const Product = require("../model/product");
const User = require("../model/user");
const blacklistedUser = require("../model/blackList");
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
    }).populate("category");

    res.status(200).json(productsByCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
module.exports = {
  add_category,
  get_category,
  get_product_by_category,
  listBlacklistedUsers,
};
