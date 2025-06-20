import express from "express";
import {
    register,
    login,
    logout,
    getDemoUser,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/demo-user", getDemoUser);

export default router;
