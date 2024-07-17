import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new order (protected route)
router.post("/", protect, createOrder);

// Get all orders for the authenticated user (protected route - buyer or seller)
router.get("/myorders", protect, getMyOrders);

// Get order details by ID (protected route - buyer or seller with access)
router.get("/:id", protect, getOrderById);

// Update order status (protected route - authorized seller only)
router.put("/:id/status", protect, authorize("seller"), updateOrderStatus);

export default router;
