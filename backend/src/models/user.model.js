import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import config from "../config/config.js";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: [4, "Password must be at least 4 characters"],
        maxLength: [50, "Name must be at most 50 characters"]
    },
    password: {
        type: String,
        required: true,
        trim: true,

    },

});

userSchema.statics.hashPassword  = function (password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
}


userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id, email: this.email }, config.JWT_SECRET, { expiresIn: '24h' });
}

userSchema.statics.ValidateToken = function (token) {
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        return decoded;
    } catch (error) {
        return false;
    }
}


const  userModel = mongoose.model("user", userSchema)


export default userModel;