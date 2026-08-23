const jwt = require('jsonwebtoken')

const config = require('../../config')

function generateAccessToken(payload) {
    return jwt.sign(payload, config.env.jwtSecret, {
        expiresIn: config.env.jwtExpiresIn,
    })
}

function generateRefreshToken(payload) {
    return jwt.sign(payload, config.env.jwtRefreshSecret, {
        expiresIn: config.env.jwtRefreshExpiresIn,
    })
}

function verifyAccessToken(token) {
    return jwt.verify(token, config.env.jwtSecret)
}

function verifyRefreshToken(token) {
    return jwt.verify(token, config.env.jwtRefreshSecret)
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
}
