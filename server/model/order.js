const mongoose = require("mongoose");
const Product = require("./product");
const orderItem = require("./orderItem");
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    { type: mongoose.Schema.Types.ObjectId, ref: "OrderItem", required: true },
  ],
  totalPrice: { type: Number },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled", "Accepted"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid"
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  phoneNumber: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
