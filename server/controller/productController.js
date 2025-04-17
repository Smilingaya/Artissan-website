const express = require("express");
const { upload } = require("../utils/cloudinaryConfig");
const cloudinary = require("cloudinary").v2;
const User = require("../model/user");
const Post = require("../model/post");
const Product = require("../model/product");
const { extractPublicId } = require("../helper/helper");
const create_product = async (req, res) => {
  try {
    const picture = req.files["mainImage"]?.[0];
    const images = req.files["multipleFiles"] || [];

    const { userId, name, discreption, price, stoke, category } = req.body;
    let imageUrl = "";
    if (picture) {
      const uploadres = await cloudinary.uploader.upload(picture.path, {
        folder: "product_pictures",
      });
      imageUrl = uploadres.secure_url;
    }
    let imagesUrls = [];
    const uploadFiles = await Promise.all(
      images.map((file) => {
        return cloudinary.uploader.upload(file.path, {
          folder: "product_pictures",
        });
      })
    );
    imagesUrls = uploadFiles.map((file) => file.secure_url);
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const newProduct = new Product({
      user: userId,
      name,
      discreption,
      price,
      stoke,
      mainImage: imageUrl,
      category,
      multipleFiles: imagesUrls,
    });

    await newProduct.save();
    user.products.push(newProduct._id);
    await user.save();

    res
      .status(200)
      .json({ message: "Product created successfully!", product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const Get_product = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userProducts = await Product.find({ user: userId });
    res.status(200).json({ success: true, products: userProducts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const Get_One_Product = async (req, res) => {
  const id = req.params.productId;
  Product.findById(id)
    .then((resault) => {
      if (!resault) {
        return res.status(404).json({ message: "product not found !" });
      }
      res.status(200).json({ resault });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
const delete_product = async (req, res) => {
  const id = req.params.productId;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const publicIds = [];
    if (product.mainImage) {
      const publicId = extractPublicId(product.mainImage);
      if (publicId) publicIds.push(publicId);
    }
    if (product.multipleFiles && product.multipleFiles.length > 0) {
      product.multipleFiles.forEach((fileUrl) => {
        const publicId = extractPublicId(fileUrl);
        if (publicId) publicIds.push(publicId);
      });
    }
    await Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id)));
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const Update_product = async (req, res) => {
  const id = req.params.productId;
  const { name, discreption, price, stoke, category } = req.body;
  const picture = req.files["mainImage"]?.[0];
  const images = req.files["multipleFiles"] || [];
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const Ids = [];
    if (product.mainImage) {
      const publicId = extractPublicId(product.mainImage);
      if (publicId) Ids.push(publicId);
    }
    if (product.multipleFiles && product.multipleFiles.length > 0) {
      product.multipleFiles.forEach((fileUrl) => {
        const publicId = extractPublicId(fileUrl);
        if (publicId) Ids.push(publicId);
      });
    }
    await Promise.all(Ids.map((id) => cloudinary.uploader.destroy(id)));
    let imageUrl = "";
    if (picture) {
      const uploaders = await cloudinary.uploader.upload(picture.path, {
        folder: "product_pictures",
      });
      imageUrl = uploaders.secure_url;
    }
    let imagesUrls = [];
    const uploadFiles = await Promise.all(
      images.map((file) => {
        return cloudinary.uploader.upload(file.path, {
          folder: "product_pictures",
        });
      })
    );
    imagesUrls = uploadFiles.map((file) => file.secure_url);
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        discreption,
        price,
        stoke,
        category,
        mainImage: imageUrl || product.mainImage,
        multipleFiles: imagesUrls || product.multipleFiles,
      },
      { new: true }
    );
    res.status(200).json({ updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  create_product,
  Get_product,
  Get_One_Product,
  delete_product,
  Update_product,
};
