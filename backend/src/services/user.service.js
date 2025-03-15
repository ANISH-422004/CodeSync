import userModel from "../models/user.model.js";


export const createUser = async ({name , email , password}) => {
   
        if(!name || !email || !password) throw new Error("Email and password and Name are required")
        
        const userExists = await userModel.findOne({email})

        if(userExists) throw new Error("User already exists")

        const h_pass  = await userModel.hashPassword(password)   

        const user = await userModel.create({name , email , password : h_pass})

        return user
            
    
}


