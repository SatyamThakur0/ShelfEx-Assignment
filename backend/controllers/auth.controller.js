import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {
    try {
        const { email, name, username, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ ok: false, message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            email,
            name,
            username,
            password: hashedPassword,
            role: role || "public",
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Set token in cookie
        res.cookie("token", token, {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            httpOnly: true, // Don't expose cookie to JS
            secure: true, // Required for HTTPS (Render uses HTTPS)
            sameSite: "none", // Or "None" if frontend/backend are on different subdomains
            path: "/",
        });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json({
            ok: true,
            message: "User registered successfully",
            user: userResponse,
            token,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error registering user",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ ok: false, message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ ok: false, message: "Invalid credentials" });
        }

        // Generate token
        const token = generateToken(user._id);

        // Set token in cookie
        res.cookie("token", token, {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            httpOnly: true, // Don't expose cookie to JS
            secure: true, // Required for HTTPS (Render uses HTTPS)
            sameSite: "none", // Or "None" if frontend/backend are on different subdomains
            path: "/",
        });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            ok: true,
            message: "Login successful",
            user: userResponse,
            token,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error logging in",
            error: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({ ok: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error logging out",
            error: error.message,
        });
    }
};
