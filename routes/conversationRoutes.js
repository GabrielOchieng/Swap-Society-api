import express from "express";

import { protect, authorize } from "../middlewares/authMiddleware.js";
import {
  createConversation,
  getConversation,
} from "../controllers/conversationController.js";

const router = express.Router();

// Create a new conversation
router.post("/", createConversation);

// Get conversations for a user
router.get("/:userId", getConversation);

export default router;
