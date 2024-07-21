import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// Get all products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("seller");
  res.status(200).json(products);
});

// Get a single product
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate("seller"); // populate seller details

  if (!product) {
    res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
});

const getMyListedProducts = asyncHandler(async (req, res) => {
  // 1. Check user authorization (assuming middleware is already implemented):
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized to access listed products" });
  }

  // 2. Fetch products based on seller ID:
  const products = await Product.find({ seller: req.user._id });

  res.status(200).json(products);
});

// Create a product (requires authorization - seller only)
// const createProduct = asyncHandler(async (req, res) => {
//   const { title, description, price, location, category, images } = req.body;

//   // Check if user is seller (implement authorization middleware here)

//   const product = new Product({
//     title,
//     description,
//     price,
//     location,
//     category,
//     images,
//     seller: req.user._id, // Get seller ID from authorized user
//   });

//   const createdProduct = await product.save();
//   res.status(201).json(createdProduct);
// });

const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, location, category, images } = req.body;

  // 1. Check for missing fields:
  if (!title || !description || !price || !location || !category) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  // 2. Check authorization (assuming middleware is already implemented):
  // if (!req.user || !req.user.isSeller) {
  //   return res.status(401).json({ message: "Unauthorized to create product" });
  // }

  try {
    // 3. Create and save product (use try-catch for database errors):
    console.log(req.user);
    const product = new Product({
      title,
      description,
      price,
      location,
      category,
      images: req.images,
      seller: req.user._id,
    });
    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a product (requires authorization - seller only)
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, category, images } = req.body;

  // Check if user is seller and authorized to update this product (implement authorization middleware here)

  const product = await Product.findByIdAndUpdate(
    id,
    { title, description, price, location, category, images },
    { new: true } // Return the updated product
  );

  if (!product) {
    res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
});

// Delete a product (requires authorization - seller only)
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user is seller and authorized to delete this product (implement authorization middleware here)

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json({ message: "Product deleted successfully" });
});

export {
  getProducts,
  getProductById,
  getMyListedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
