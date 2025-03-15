import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import redisClient from "../services/redis.service.js";

export const createUserHandler = async (req, res) => {
    try {
        // Validate request body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body
        const user = await createUser({ name, email, password });
        const token = await user.generateToken()

        const userObj = user.toObject();
        delete userObj.password;

        res.json({ token, user: userObj });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const loginHandler = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        const token = await user.generateToken();


        const userObj = user.toObject();
        delete userObj.password;

        res.json({ token, user: userObj });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getProfileHandler = async (req, res) => {
    try {
        const user = req.user
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export const LogoutHandeler = async (req, res) => {
    try {
        const token = req?.cookies?.token || req.headers?.authorization?.split(" ")[1]

        redisClient.set(token, 'logout', "EX", 60 * 60 * 24) // key , value , ExpiresIn , 24hr


        res.status(200).json({
            message: "Logged Out Successfully"
        })



    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }
}

export const SearchUsersHandler = async (req, res) => {
    try {
        console.log("Search Query:", req.params.searchQuery);
        
        const { searchQuery } = req.params;
        const users = await userModel.find({
            $and: [
                {
                    $or: [
                        { name: { $regex: searchQuery, $options: 'i' } },
                        { email: { $regex: searchQuery, $options: 'i' } }
                    ]
                },
                { _id: { $ne: req.user._id } }
            ]
        }).select('-password');

        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}