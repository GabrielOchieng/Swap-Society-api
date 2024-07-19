import express from "express";
import {
  getProducts,
  getProductById,
  getMyListedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer/multer.js";
import { uploadMultiple } from "../middlewares/uploads/uploadMultiple.js";

const router = express.Router();

// Get all products (public route)
router.get(
  "/",
  // protect,
  getProducts
);

// Get a single product by ID (public route)
router.get("/:id", getProductById);

router.get(
  "/:userId/products",
  protect,
  authorize("seller"),
  getMyListedProducts
);

// Create a new product (protected route, accessible only to sellers)
router.post(
  "/",
  protect,
  authorize("seller"),
  upload.array("images"),
  uploadMultiple,
  createProduct
);

// Update a product (protected route, accessible only to seller who created the product)
router.put("/:id", protect, authorize("seller"), updateProduct);

// Delete a product (protected route, accessible only to seller who created the product)
router.delete("/:id", protect, authorize("seller"), deleteProduct);

export default router;
