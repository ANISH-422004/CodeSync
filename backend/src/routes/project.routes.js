import { Router } from "express";
import { addUserValidations, projectCreationValication } from "../middleware/project.middleware.js";
import { AuthUser } from "../middleware/user.middleware.js";
import { addUsersToaProjectController, createProjectController, getAllProjectsOfUserController, getAprojectDetailsHandeler } from "../controller/project.controller.js";

const router = Router()


router.post("/create", AuthUser, projectCreationValication, createProjectController)
router.get("/all", AuthUser, getAllProjectsOfUserController)
router.put('/adduser', AuthUser, addUserValidations, addUsersToaProjectController)
router.get("/getproject/:projectId", AuthUser, getAprojectDetailsHandeler)
export default router