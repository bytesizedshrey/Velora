import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const isProduction = process.env.NODE_ENV === "production";

const getCookieOptions = () => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
});

export const register = async (req, res) => {
    try {
        const { email, password, fullname, role } = req.body

        if (!email || !password || !fullname) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const isUserExists = await userModel.findOne({ email })

        if (isUserExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            email,
            password: hashedPassword,
            fullname,
            role: role || "buyer"
        })

        const token = jwt.sign({
            id: user._id,
        }, config.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token, getCookieOptions())

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                role: user.role
            }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const token = jwt.sign({
            id: user._id,
        }, config.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token, getCookieOptions())

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                role: user.role
            }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
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
        } else if (!user.googleId) {
            user.googleId = id
            await user.save()
        }

        const token = jwt.sign({
            id: user._id,
        }, config.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token, getCookieOptions())

        // Smart production detection: Check FRONTEND_URL, NODE_ENV, or Host header
        const hostHeader = req.headers.host || "";
        const isRenderHost = hostHeader.includes("onrender.com");
        const isProdEnv = process.env.NODE_ENV === "production" || isRenderHost;

        let targetFrontend = process.env.FRONTEND_URL;
        if (!targetFrontend) {
            targetFrontend = isProdEnv
                ? "https://velora-one-rouge.vercel.app"
                : "http://localhost:5173";
        }

        res.redirect(targetFrontend)
    } catch (error) {
        console.error("Error in googleCallback:", error);
        const hostHeader = req.headers.host || "";
        const isRenderHost = hostHeader.includes("onrender.com");
        const isProdEnv = process.env.NODE_ENV === "production" || isRenderHost;

        let targetFrontend = process.env.FRONTEND_URL;
        if (!targetFrontend) {
            targetFrontend = isProdEnv
                ? "https://velora-one-rouge.vercel.app"
                : "http://localhost:5173";
        }
        res.redirect(`${targetFrontend}/login`)
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        return res.status(200).json({ user })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
