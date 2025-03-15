import { body } from "express-validator";

export const projectCreationValication = [
    body('name').notEmpty().withMessage("Name is required").isString().withMessage("Name must be String")
]

export const addUserValidations = [
    body('users').isArray().withMessage('Users must be an array')
    .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string') , 
    body('projectId').notEmpty().withMessage("Project ID is required").isString().withMessage("Project ID must be a string")
]