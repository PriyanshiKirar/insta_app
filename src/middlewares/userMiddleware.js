import { body } from 'express-validator'

export const registerMiddleware=[
    body('username')
    .isString()
    .withMessage("username must be a String")
    .isLength({ min: 3, max: 15 })
    .withMessage("username must be bitween 3 or 15 charancter")
    .custom((value)=> value === value.toLowerCase()),
body('email')
    .isEmail()
    .withMessage("Email must be a valid email"),
body('password')
    .isString()
    .withMessage("password must be a string")
    .isLength({ min: 5 })
    .withMessage("password must be 5 charanter"),
]