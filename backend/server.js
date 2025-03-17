import app from './src/app.js'
import config from './src/config/config.js'
import http from 'http'
import dbConnection from './src/db/db.js'
import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import mongoose from 'mongoose'
import projectModel from './src/models/project.model.js'
import userModel from './src/models/user.model.js'
import { generateResult } from './src/services/gemini.service.js'

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

dbConnection();


// Middleware for Socket.io authentication
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1];
        const projectId = socket.handshake.query.projectId

        if (!projectId) return next(new Error("Project ID is required"));

        // Assuming you have a function to check if the projectId is valid
        const isValidProjectId = mongoose.Types.ObjectId.isValid(projectId)
        if (!isValidProjectId) return next(new Error("Invalid Project ID"));

        socket.project = await projectModel.findById(projectId)


        if (!token) return next(new Error("Authentication Error"));

        const decoded = jwt.verify(token, config.JWT_SECRET);
        if (!decoded) return next(new Error("Authentication Error"));

        socket.user = decoded;
        next();

    } catch (error) {
        next(error);
    }
});




// Handling socket connection
io.on('connection', (socket) => {

    socket.roomId = socket.project._id.toString()

    socket.join(socket.roomId)

    socket.on('project-message', async (data) => {
        console.log(data)

        const message = data.message
        const aiIsPresent = message.includes("@ai")
        if (aiIsPresent) {
            const prompt = message.replace("@ai", "")
            const result = await generateResult(prompt)

            //it should be send to every on (io)
            

            io.to(socket.roomId).emit("project-message", {
                message: result,
                sender:{
                    _id: "Gemini",
                    email: "AI Response"
                }
            })

}


        socket.broadcast.to(socket.roomId).emit("project-message", data)
    })



socket.on('disconnect', () => {
    console.log("User disconnected:", socket.id);
    socket.leave(socket.room)
});
});





// Start server
server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});
