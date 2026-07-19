import  jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { config } from "../config/config.js";

async function sendTokenResponse(user,res){
    const token = jwt.sign({
        id : user._id
     },config.JWT_SECRET)
}

export const register = async (req,res) => {
    const {email,contact,password,fullname,role} = req.body

    try {
        const existingUser = await userModel.findOne({
            $or : [
                {email},
                {contact}
            ]
        })

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            email,
            contact,
            password: hashedPassword,
            fullname,
            role: role || "buyer"
        })

        const userResponse = user.toObject()
        delete userResponse.password

        return res.status(201).json({
            message: "User registered successfully",
            user: userResponse
        })

        if(existingUser){
            return res.status(400).json({message : "User with this email or contact already exists"})
        }

        // const user = await userModel.create({
        //     email,
        //     contact,
        //     password,
        //     fullname
        // })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "server error"})
    }
}