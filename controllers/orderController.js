import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Create a new order (protected route)
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress } = req.body;

  if (orderItems.length === 0) {
    res.status(400).json({ message: "No items in order cart" });
    return;
  }

  const user = req.user; // Get user from authorization

  let orderItemsWithPrices = [];
  let totalPrice = 0;

  for (const item of orderItems) {
    const product = await Product.findById(item.productId);
    if (!product) {
      res
        .status(400)
        .json({ message: `Product with ID ${item.productId} not found` });
      return;
    }

    const quantity = item.quantity;

    // Check product stock (optional)
    if (product.stock < quantity) {
      res
        .status(400)
        .json({ message: `Product with ID ${item.productId} is out of stock` });
      return;
    }

    totalPrice += product.price * quantity;
    orderItemsWithPrices.push({
      productId: product._id,
      quantity,
      price: product.price,
      name: product.title,
    });
  }

  const order = new Order({
    buyer: user._id,
    seller: orderItemsWithPrices[0].productId.seller, // Assuming all items belong to the same seller (modify if needed)
    products: orderItemsWithPrices,
    totalPrice,
    shippingAddress,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// Get all orders for a specific user (protected route - buyer or seller)
const getMyOrders = asyncHandler(async (req, res) => {
  const user = req.user; // Get user from authorization

  const orders = await Order.find({
    $or: [{ buyer: user._id }, { seller: user._id }],
  });
  res.status(200).json(orders);
});

// Get order details by ID (protected route - buyer or seller with access)
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate(
    "products.productId",
    "title price image" // Specify product fields to populate
  );

  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  // Check if user (buyer or seller) has access to this order (implement authorization logic here)

  res.status(200).json(order);
});

// Update order status (protected route - authorized seller only)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    res.status(400).json({ message: "Please provide order status" });
    return;
  }

  const order = await Order.findById(id);

  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  // Check if user is authorized seller for this order (implement authorization logic here)

  order.status = status;

  const updatedOrder = await order.save();
  res.status(200).json(updatedOrder);
});

export { createOrder, getMyOrders, getOrderById, updateOrderStatus };
