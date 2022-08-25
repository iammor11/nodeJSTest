const express = require('express');
const { body, check, validationResult } = require('express-validator');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/login',
    check("email", "email is required!")
        .notEmpty(),
    check("password", "password is required!")
        .notEmpty(),
    body('email').isEmail().withMessage({
        message: 'Not an email',
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next()
    },
    authController.postLogin);

router.post('/register',
    check("email", "email is required!")
        .notEmpty(),
    check("password", "password is required!")
        .notEmpty(),
    check("firstName", "firstName is required!")
        .notEmpty(),
    check("lastName", "lastName is required!")
        .notEmpty(),
    body('email').isEmail().withMessage({
        message: 'Not an email',
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next()
    },
    authController.postRegister);

module.exports = router;