import dotenv from "dotenv";
dotenv.config();

const _config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,



}

const config = Object.freeze(_config)

export default config