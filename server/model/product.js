const mongoose = require("mongoose");
const { isFloat } = require("validator");
const Category = require("./category");
const User = require('./user');
const ProductSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  name: {
    type: String,
    required: true,
  },
  discreption: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
  },
  stoke: {
    type: Number,
    required: true,
  },
  mainImage: {
    type: String,
    required: true,
  },
  multipleFiles: [
    {
      type: String,
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  createdAt: { type: Date, default: Date.now },
});
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
