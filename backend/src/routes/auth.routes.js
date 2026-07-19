import { Router } from "express";
import { validationRegisterUser } from "../validator/auth.validator.js";
import { register } from "../controllers/auth.contoller.js";

const router = Router()

router.post('/register', validationRegisterUser, register)

export default router