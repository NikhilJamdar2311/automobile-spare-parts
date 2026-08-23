const jwt = require('jsonwebtoken')
const config = require('../../config')

function generateToken(payload) {
    return jwt.sign(payload, config.env.jwtSecret, {
        expiresIn: config.env.jwtExpiresIn,
    })
}

function verifyToken(token) {
    return jwt.verify(token, config.env.jwtSecret)
}

module.exports = {
    generateToken,
    verifyToken,
}
