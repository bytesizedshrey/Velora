import { Router } from "express";
import { validationRegisterUser, validationLoginUser } from "../validator/auth.validator.js";
import { register, login, getMe, logout, googleCallback } from "../controllers/auth.contoller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = Router()

router.post('/register', validationRegisterUser, register)
router.post('/login', validationLoginUser, login)
router.get('/me', protectRoute, getMe)
router.post('/logout', logout)

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/google/callback", passport.authenticate("google", { session: false }), googleCallback)

export default router