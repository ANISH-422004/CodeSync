import projectModel from "../models/project.model.js"
import { addUsersToProject, createProject, getallProjects, getProjectById } from "../services/project.service.js";
import { validationResult } from "express-validator";


export const createProjectController = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { name } = req.body // project name
        const userId = req.user._id

        const newProject = await createProject({ name, userId })
        res.status(201).json(newProject)

    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message })
    }
}


export const getAllProjectsOfUserController = async (req, res) => {
    try {
        const userId = req.user._id

        const projects = await getallProjects(userId)
        
        res.status(200).json(projects)

    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message })
    }
}

export const addUsersToaProjectController = async (req, res) => {
    try {
        // console.log(Array.isArray(req.body.users))
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

        const { projectId, users } = req.body
        const loggedInUserId = req.user._id

        const updatedProject = await addUsersToProject({ projectId, users, loggedInUserId })

        res.status(200).json({ updatedProject })


    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message })

    }

}

export const getAprojectDetailsHandeler = async (req,res) => {
    try {
        const { projectId } = req.params
        // console.log(projectId)
        const project = await getProjectById(projectId)

        res.status(200).json(project)

    } catch (error) {
        console.log(error)
    }
}
