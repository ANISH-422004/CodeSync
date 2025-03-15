import mongoose from "mongoose";
import projectModel from "../models/project.model.js";


export const createProject = async ({ name, userId }) => {
    if (!name) throw new Error('Name is Required')
    if (!userId) throw new Error('User is Required')

    const existingProject = await projectModel.findOne({ name });
    if (existingProject) throw new Error('Project name already in use, use a different project name');

    const project = await projectModel.create({
        name,
        author: userId,
        users: [userId]
    })
    return project
}

export const getallProjects = async (userId) => {
    if (!userId) throw new Error('User is Required')

    const projects = await projectModel.find({
        $or: [
            { users: { $in: [userId] } },  // Check if user is in the `users` array
            { author: userId }  // Check if user is the author
        ]
    }).populate('users', '-password');  // Populate users array and exclude the password field
    return projects
}


export const addUsersToProject = async ({ projectId, users, loggedInUserId }) => {

    if (!projectId) throw new Error("ProjectId required")
    if (!mongoose.Types.ObjectId.isValid(projectId)) throw new Error("Invalid ProjectId")
    if (!users) throw new Error("users are required")
    if (!Array.isArray(users)) throw new Error("Users should be an array");
    users.forEach(user => {
        if (!mongoose.Types.ObjectId.isValid(user)) {
            throw new Error(`Invalid user ID in users Array`);
        }
    });


    const project = await projectModel.findOneAndUpdate(
        { _id: projectId, author: loggedInUserId },
        { $addToSet: { users: { $each: users } } },
        { new: true }
    );

    if (!project) throw new Error("You are not authorized to add users to this project or project does not exist");

    return project;
}


export const getProjectById = async (projectId) => {
    if (!projectId) throw new Error("ProjectId required");
    if (!mongoose.Types.ObjectId.isValid(projectId)) throw new Error("Invalid ProjectId");

    const project = await projectModel.findById(projectId).populate('users');

    if (!project) throw new Error("Project not found");

    return project;
}
