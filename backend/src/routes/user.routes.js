import express from "express";
import { createUserHandler, getProfileHandler, loginHandler, LogoutHandeler, SearchUsersHandler } from "../controller/user.controller.js";
import { AuthUser, validateLoginUser, validateRegiteringUser } from "../middleware/user.middleware.js";

const router = express.Router();



// Routes

// User registration route
router.post("/register", validateRegiteringUser, createUserHandler);
// User Login route
router.post("/login", validateLoginUser, loginHandler );
// profile route
router.get("/profile" , AuthUser , getProfileHandler); 
//Logout route
router.get("/logout" , AuthUser , LogoutHandeler)
//serache user
router.get("/matchingusers/:searchQuery", AuthUser, SearchUsersHandler);


export default router;
