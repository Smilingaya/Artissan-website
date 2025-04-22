const mongoose = require("mongoose");
const Product = require("./product");

const OrderItemSchema = new mongoose.Schema({
  quantity: { type: Number, required: true, min: 1 },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});
const OrederItem = mongoose.model("OrderItem", OrderItemSchema);
module.exports = OrederItem;
