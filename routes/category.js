const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/category');
const isLogin = require('../middlewares/checkAuth');

const router = express.Router();

router.post('/load_categories', isLogin.verifyJWT,
    check("page", "page no is required!")
        .notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next()
    },
    authController.getCategories);

module.exports = router;