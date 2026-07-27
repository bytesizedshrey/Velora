import { Router } from "express";
import { validationRegisterUser, validationLoginUser } from "../validator/auth.validator.js";
import { register, login, googleCallback, getMe } from "../controllers/auth.contoller.js";
import passport from "passport";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router()

const fallbackFrontendUrl = process.env.FRONTEND_URL || "https://velora-one-rouge.vercel.app";

router.post('/register', validationRegisterUser, register)
router.post('/login', validationLoginUser, login)

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/google/callback", passport.authenticate("google", {
    session: false,
    failureRedirect: `${fallbackFrontendUrl}/login`
}), googleCallback)

router.get("/me", authenticateUser, getMe)

export default router