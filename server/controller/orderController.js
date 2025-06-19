const express = require("express");
const Order = require("../model/order");
const User = require("../model/user");
const Product = require("../model/product");
const OrderItem = require("../model/orderItem");
const create_order = async (req, res) => {
  try {
    const artisanId = req.params.id;
    const { userId, items, shippingAddress, phoneNumber } = req.body;
    const user = await User.findById(userId);
    const artisan = await User.findById(artisanId);
    console.log(artisanId);
    if (!user || !artisan) {
      return res.status(404).json({
        success: false,
        message: "User or artisan not found",
      });
    }

    let totalPrice = 0;
    let orderItemsIds = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      console.log(item);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }
      if (product.user.toString() !== artisanId) {
        return res.status(400).json({
          success: false,
          message: "Product does not belong to artisan",
        });
      }
      if (product.stoke < item.quantity) {
        return res
          .status(400)
          .json({ success: false, message: "Not enough stock" });
      }
      totalPrice += product.price * item.quantity;
      product.stoke -= item.quantity;
      await product.save();
      const orderItem = new OrderItem({
        product: product._id,
        quantity: item.quantity,
      });
      await orderItem.save();
      orderItemsIds.push(orderItem._id);
    }

    const newOrder = new Order({
      user: userId,
      items: orderItemsIds,
      totalPrice,
      shippingAddress,
      phoneNumber,
    });
    await newOrder.save();
    user.orders.push(newOrder._id);
    await user.save();
    artisan.commandedProducts.push(newOrder._id);
    await artisan.save();
    res.status(200).json({
      success: true,
      message: "Order created successfully!",
      order: newOrder,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const Get_user_orders = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).populate({
  path: 'orders',
  populate: {
    path: 'items',
    populate: {
      path: 'product',
      populate: {
        path: 'user', 
        select: 'name _id'
      }
    }
  }
});

    res.status(200).json({ success: true, orders: user.orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const delete_order = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be deleted",
      });
    }

    const orderItems = await OrderItem.find({
      _id: { $in: order.items },
    }).populate("product");
    for (const item of orderItems) {
      const product = await Product.findById(item.product._id);
      product.stoke += item.quantity;
      await product.save();
    }
    const artisanId = orderItems[0]?.product?.user;

    if (artisanId) {
      await User.findByIdAndUpdate(artisanId, {
        $pull: { commandedProducts: order._id },
      });
    }
    console.log("Order items:", order.items);
    await OrderItem.deleteMany({ _id: { $in: order.items } });

    await User.findByIdAndUpdate(order.user, {
      $pull: { orders: order._id },
    });

    await Order.findByIdAndDelete(orderId);

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const get_user_commanded_products = async (req, res) => {
  const artisanId = req.params.artisanId;
  try {
    const artisan = await User.findById(artisanId).populate({
  path: "commandedProducts",
  populate: [
    { path: "items", populate: { path: "product", populate: "user" } },
    { path: "user" }
  ]
});

    res.status(200).json({
      success: true,
      commandedOrders: artisan.commandedProducts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const update_status = async (req, res) => {
  const { orderId } = req.params;
  const { status, paymentStatus } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        ...(status && { status }),             // optional update of order status
        ...(paymentStatus && { paymentStatus }) // optional update of payment status
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const Get_One_order = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId);
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const length_order = async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
module.exports = {
  create_order,
  Get_user_orders,
  delete_order,
  get_user_commanded_products,
  update_status,
  Get_One_order,
  length_order,
};
