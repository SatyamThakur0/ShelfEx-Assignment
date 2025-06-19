// utils/redis.js
import dotenv from "dotenv";
dotenv.config();
import { createClient } from "redis";
console.log(process.env.REDIS_URL);

export const pubClient = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: "redis-17128.c276.us-east-1-2.ec2.redns.redis-cloud.com",
        port: 17128,
    },
});
export const subClient = pubClient.duplicate();

let isConnected = false;

export const connectRedis = async () => {
    if (isConnected) return; // prevent double connection

    try {
        await pubClient.connect();
        await subClient.connect();
        console.log("✅ Redis pub/sub connected");
        isConnected = true;
    } catch (err) {
        console.error("❌ Redis connection failed", err);
        throw err;
    }
};

export const notifyFollowers = async (post, followers) => {
    if (!isConnected) {
        console.error("❌ Redis client not connected");
        return;
    }

    try {
        const payload = { post, followers };
        await pubClient.publish("new-post", JSON.stringify(payload));
    } catch (err) {
        console.error("❌ Failed to publish post to Redis:", err);
    }
};
