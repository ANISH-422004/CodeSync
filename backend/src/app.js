
import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "./routes/user.routes.js"; 
import projectRoutes from "./routes/project.routes.js"
import cookieParser from "cookie-parser";
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(cookieParser())



// Routes
app.use("/users", userRoutes);
app.use("/projects" , projectRoutes)

app.get("/", (req, res) => {
  res.json({ message: "API is Working" });
});

export default app;
