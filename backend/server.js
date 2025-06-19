import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { verifyToken } from "./utils/jwt.js";
import User from "./models/user.model.js";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import { subClient } from "./utils/redis.js";
import { connectRedis } from "./utils/redis.js";
// Load environment variables
dotenv.config();
const startServer = async () => {
    try {
        await connectRedis(); // ✅ must be first
        console.log("Redis connected");

        // Now setup routes and start server
    } catch (err) {
        console.error("❌ Redis connection failed:", err);
        process.exit(1); // exit if Redis fails
    }
};

startServer();



// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PATCH"],
        credentials: true,
    },
});
app.get("/check", (req, res) => {
    return res.json({ ok: true, status: "running" });
});

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Socket.IO middleware for authentication
io.use(async (socket, next) => {
    try {
        const token = socket?.handshake.auth.token;
        if (!token) {
            console.log("Unauthorized");
        }

        const decoded = verifyToken(token);

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            console.log("Unauthorized");
        }

        socket.user = user;
        next();
    } catch (error) {
        next(new Error("Authentication error"));
    }
});

// Socket.IO connection handler
io.on("connection", (socket) => {
    console.log(`User connected: ${socket?.user?.username}`);

    // Join user's personal room
    socket.join(socket?.user?._id.toString());
    console.log("User joined room ", socket?.user?._id.toString());

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket?.user?.name}`);
        socket.broadcast.emit("user:offline", {
            userId: socket?.user?._id,
            status: "offline",
        });
    });
});
subClient.subscribe("new-post", (payload) => {
    const data = JSON.parse(payload);
    const { post, followers } = data;
    followers.forEach((follower) => {
        io.to(follower.toString()).emit("new-post", post);
    });
});

//routes
app.use("/api", routes);

// Start server
const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
