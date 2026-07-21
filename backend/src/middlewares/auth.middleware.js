import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { config } from "../config/config.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided", success: false });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found", success: false });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        return res.status(401).json({ message: "Unauthorized - Invalid token", success: false });
    }
};
