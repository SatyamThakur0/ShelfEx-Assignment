import { verifyToken } from "../utils/jwt.js";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
    try {
        // Get token from cookie
        const token =
            req.cookies.token || req.headers?.authorization?.split(" ")[1];

        if (!token) {
            return res
                .status(401)
                .json({ ok: false, message: "No token, authorization denied" });
        }

        // Verify token
        const decoded = verifyToken(token);

        // Get user from token
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res
                .status(401)
                .json({ ok: false, message: "User not found" });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ ok: false, message: "Token is not valid" });
    }
};
