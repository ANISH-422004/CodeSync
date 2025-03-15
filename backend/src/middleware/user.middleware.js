import { body } from "express-validator";
import userModel from "../models/user.model.js";
import redisClient from "../services/redis.service.js";

export const validateRegiteringUser = [
    body("name").notEmpty().withMessage("Name is required").isString().withMessage("Name must be a string"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 3 }).withMessage("Password must be at least 3 characters long"),
];

export const validateLoginUser = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 3 }).withMessage("Password must be at least 3 characters long"),
];

export const AuthUser = async (req, res, next) => {
    const token = req?.cookies?.token || req.headers?.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const isBackListed = await redisClient.get(token) // Logged Out token must not be authenticated 

    if (isBackListed) {
        res.cookie('token', '')
        return res.status(401).json({ message: "Unauthorized" })
    }

    const decoded = userModel.ValidateToken(token)

    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    req.user = await userModel.findById(decoded._id).select('-password');

    next()


} 