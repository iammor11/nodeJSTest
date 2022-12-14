require('dotenv').config({ path: '../' })
const jwt = require('jsonwebtoken');

module.exports.verifyJWT = async (req, res, next) => {
    try {
        const authHeader = await req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Auth failed, there is no authorization header."
            })
        }
        const token = await authHeader.split(" ")[1];
        let decodedToken;
        try {
            decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
        }
        catch (error) {
            return res.status(500).json({
                message: "Can't verify authentication token, please login again",
                error
            })
        }
        req.userId = decodedToken;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: 'Auth failed',
            error
        });
    }
};