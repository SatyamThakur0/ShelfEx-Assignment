import { Router } from "express";
import {
    followUnfollowCeleb,
    getFollowingUsers,
    getProfile,
    searchCeleb,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/search", protect, searchCeleb);
router.get("/get-followed-users", protect, getFollowingUsers);
router.get("/get-profile/:id", protect, getProfile);
router.post("/follow/:celebUsername", protect, followUnfollowCeleb);

export default router;
