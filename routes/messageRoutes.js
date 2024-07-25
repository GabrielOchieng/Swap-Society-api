import express from "express";

import { protect, authorize } from "../middlewares/authMiddleware.js";
import { createMessage, getMessage } from "../controllers/messageController.js";

const router = express.Router();

// Create a new conversation
router.post("/", createMessage);

// Get conversations for a user
router.get("/:conversationId", getMessage);

export default router;
