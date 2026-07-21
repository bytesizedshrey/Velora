import { Router } from "express";
import { validationRegisterUser, validationLoginUser } from "../validator/auth.validator.js";
import { register, login, getMe, logout } from "../controllers/auth.contoller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router()

router.post('/register', validationRegisterUser, register)
router.post('/login', validationLoginUser, login)
router.get('/me', protectRoute, getMe)
router.post('/logout', logout)

export default router