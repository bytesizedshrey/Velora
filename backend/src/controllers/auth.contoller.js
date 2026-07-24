import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { config } from "../config/config.js";

async function sendTokenResponse(user, res, message, statusCode = 200) {
    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(statusCode).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })
}

export const register = async (req, res) => {
    const { email, contact, password, fullname, role,isSeller } = req.body

    try {
        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (existingUser) {
            return res.status(400).json({ message: "User with this email or contact already exists" })
        }

        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
            role: isSeller ? "seller" : "buyer"
        })

        return await sendTokenResponse(user, res, "User registered successfully.", 201)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password", success: false })
        }

        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password", success: false })
        }

        return await sendTokenResponse(user, res, "user logged successfully")
    } catch (error) {
        console.error("Error in login controller:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export const googleCallback = async (req, res) => {
    try {
        const { id, displayName, emails } = req.user
        const email = emails[0].value

        let user = await userModel.findOne({ email })

        if (!user) {
            user = await userModel.create({
                email,
                googleId: id,
                fullname: displayName
            })
        }

        const token = jwt.sign({
            id: user._id,
        }, config.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token)
        res.redirect("http://localhost:5173/dashboard")
    } catch (error) {
        console.error("Error in googleCallback:", error);
        res.redirect("http://localhost:5173/login")
    }
}

export const getMe = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        res.status(200).json({
            message: "User Fetched Successfully",
            success: true,
            user: {
                id: user._id,
                email: user.email,
                contact: user.contact,
                fullname: user.fullname,
                role: user.role
            }
        })
    } catch (error) {
        console.error("Error in getMe controller:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}
