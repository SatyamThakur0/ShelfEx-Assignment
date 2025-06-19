import { io } from "../server.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import { notifyFollowers } from "../utils/redis.js";

export const createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;

        const user = await User.findById(req.user._id);
        if (user.role !== "celeb") {
            return res
                .status(400)
                .json({ ok: false, message: "public user cannot create post" });
        }
        const imageUri = getDataUri(image);
        // console.log(imageUri);
        let cloudResponse;
        if (imageUri) {
            cloudResponse = await cloudinary.uploader.upload(imageUri);
        }
        const post = await Post.create({
            caption,
            author: user,
            image: cloudResponse ? cloudResponse.secure_url : "",
        });
        await post.save();
        await user.updateOne({ totalPosts: user.totalPosts + 1 });
        await user.save();

        await notifyFollowers(post, user.followers);

        res.status(201).json({
            ok: true,
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

export const getFollowingPosts = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const skip = (page - 1) * limit;

        const user = await User.findById(req.user._id);
        const following = user.following;
        const posts = await Post.find({ author: { $in: following } })
            .populate("author", "username profilePicture createdAt")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return res.status(200).json({ ok: true, posts });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const skip = (page - 1) * limit;
        const posts = await Post.find({})
            .populate("author")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return res.status(200).json({ ok: true, posts });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
};

export const getMyPosts = async (req, res) => {
    try {
        const { id } = req.params;
        const { page, limit } = req.query;
        const skip = (page - 1) * limit;
        const posts = await Post.find({ author: id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author");
        return res.status(200).json({ ok: true, posts });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const user = await User.findById(userId);
        const post = await Post.findById(id);
        if (!post) {
            return res
                .status(404)
                .json({ ok: false, message: "Post not found" });
        }
        // Only author or admin can delete
        if (
            post.author.toString() !== userId.toString() &&
            user.role !== "celeb"
        ) {
            return res.status(403).json({
                ok: false,
                message: "Not authorized to delete this post",
            });
        }

        await post.deleteOne();
        // Decrement user's totalPosts
        user.totalPosts = Math.max(0, (user.totalPosts || 1) - 1);
        await user.save();
        return res
            .status(200)
            .json({ ok: true, message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
};
