import {body} from "express-validator"


export const validationRegisterUser = [
    body("email")
    .isEmail().withMessage("Invalid email format"),

    body("contact")
    .notEmpty().withMessage("Contact is required.")
    .matches(/^\d{10}$/).withMessage('Contact must be a 10-digit number'),

    body("password")
    .isLength({min : 6}).withMessage("password must be atleast 6 character long"),

    body("fullname")
    .notEmpty().withMessage("Full name is required")
    .length({min : 3}).withMessage("Full name must be at least 3 character long"),
]