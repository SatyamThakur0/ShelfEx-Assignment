import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);

export default router;
