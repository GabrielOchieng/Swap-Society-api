import express from "express";
import { createToken, stkPush } from "../controllers/token.js";
const router = express.Router();

router.post("/", createToken, stkPush);
export default router;
