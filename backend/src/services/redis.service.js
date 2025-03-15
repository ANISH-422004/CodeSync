import Redis from "ioredis";
import config from "../config/config.js";

const redisClient = new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD,
});

redisClient.on('connect', () => {
    console.log("✅ Redis connected successfully!");
});

redisClient.on('error', (err) => {
    console.error("❌ Redis connection error:", err);
});

export default redisClient;
