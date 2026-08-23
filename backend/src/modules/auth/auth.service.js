const authRepository = require('./auth.repository')
const { comparePaasword } = require('../../common/helpers/password.helper')
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require('../../common/helpers/jwt.helper')

const ApiError = require('../../common/error/api-error')

async function login(email, password) {
    const user = await authRepository.findByEmail(email)

    if (!user) {
        throw new ApiError(401, 'Invalid email or password.')
    }

    if (!user.isActive) {
        throw new ApiError(403, 'Your account has been deactivated.')
    }

    const isPasswordValid = await comparePaasword(password, user.password)

    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid email or password.')
    }

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    }

    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken({
        id: user.id,
    })

    return {
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    }
}

async function refreshAccessToken(refreshToken) {
    if (!refreshToken) {
        throw new ApiError(401, 'Refresh token is required.')
    }

    let decoded

    try {
        decoded = verifyRefreshToken(refreshToken)
    } catch {
        throw new ApiError(401, 'Invalid or expired refresh token.')
    }

    const user = await authRepository.findById(decoded.id)

    if (!user) {
        throw new ApiError(401, 'User not found.')
    }

    if (!user.isActive) {
        throw new ApiError(403, 'Your account has been deactivated.')
    }

    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
    })

    return {
        accessToken,
    }
}

module.exports = {
    login,
    refreshAccessToken,
}
