import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all products (public route)
router.get("/", protect, getProducts);

// Get a single product by ID (public route)
router.get("/:id", getProductById);

// Create a new product (protected route, accessible only to sellers)
router.post("/", protect, authorize("seller"), createProduct);

// Update a product (protected route, accessible only to seller who created the product)
router.put("/:id", protect, authorize("seller"), updateProduct);

// Delete a product (protected route, accessible only to seller who created the product)
router.delete("/:id", protect, authorize("seller"), deleteProduct);

export default router;