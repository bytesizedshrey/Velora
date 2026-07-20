import { Router } from "express";
import { validationRegisterUser,validationLoginUser } from "../validator/auth.validator.js";
import { register,login } from "../controllers/auth.contoller.js";

const router = Router()

router.post('/register', validationRegisterUser, register)
router.post('/login', validationLoginUser, login)

export default router