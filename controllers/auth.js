require('dotenv').config({ path: '../' })
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(422).json({
                message: 'Invalid email'
            });
        }
        const matchPass = await bcrypt.compare(password, user.password)
        if (!matchPass) {
            return res.status(422).json({
                message: "Wrong password"
            })
        }
        if (matchPass) {
            const token = jwt.sign({
                email: user.email,
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName
            },
                process.env.SECRET_KEY,
                {
                    expiresIn: "7d"
                }
            );
            return res.status(200).json({
                message: "Login successfully",
                token
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "Login failed",
            error
        })
    }
}

exports.postRegister = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body
        const checkUser = await User.findOne({ email })
        if (checkUser) {
            return res.status(401).json({
                message: "E-Mail exists already, please try with a new one."
            })
        }
        const bufferToken = await crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                return res.status(500).json({
                    message: "Getting error while generating token"
                })
            }
            token = buffer.toString('hex');
        })
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        await user.save()
        return res.status(200).json({
            message: "Successfully registered!"
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong, please try again",
            error
        })
    }
}
