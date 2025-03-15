import mongoose from "mongoose";
import config from "../config/config.js";


const dbConnection = () => mongoose.connect(config.MONGO_URI).then(() => {
    console.log("DB Connected Successfully")
}).catch(err => console.log(err));

export default dbConnection;