const express = require("express");
const { upload } = require("../utils/cloudinaryConfig");
const cloudinary = require("cloudinary").v2;
const User = require("../model/user");
const Post = require("../model/post");
const Product = require("../model/product");
const create_product = async (req, res) => {
  try {
    const imagesUrls = req.files.map((file) => file.path);
    const { userId, name, discreption, price, stoke, image, category } =
      req.body;
    const user = await User.findById();
    const newProduct = new Product({
      user: userId,
      name,
      discreption,
      price,
      stoke,
      image,
      category,
      images: imagesUrls,
    });
    await newProduct.save();
    user.products.push(newProduct._id);
    await user.save();
    res
      .status(200)
      .json({ message: "create a product success !!", product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
module.exports = {
  create_product,
};
