const mongoose = require("mongoose");
const { isFloat } = require("validator");
const ProductSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

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
    required: Number,
  },
  stoke: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  images: {
    type: String,
    default: [],
  },
  category: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});
const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
