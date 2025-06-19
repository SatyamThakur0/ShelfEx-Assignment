import { Router } from "express";
import {
    createPost,
    getAllPosts,
    getFollowingPosts,
    getMyPosts,
    deletePost,
} from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const router = Router();

router.post("/create", upload.single("image"), protect, createPost);
router.get("/following-posts", protect, getFollowingPosts);
router.get("/all", protect, getAllPosts);
router.get("/:id", protect, getMyPosts);
router.delete("/:id", protect, deletePost);
export default router;
