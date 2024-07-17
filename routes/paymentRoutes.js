import express from "express";
import {
  createPayment,
  getPaymentById,
} from "../controllers/paymentController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js"; // Assuming authorization middleware

const router = express.Router();

// Creating a new payment (protected route)
router.post("/", protect, createPayment);

// Getting payment details by ID (protected route - accessible for authorized users with access to the order)
router.get("/:id", protect, authorize("buyer", "seller"), getPaymentById);

export default router;
